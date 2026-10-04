// @ts-check
(function () {
  // @ts-ignore acquireVsCodeApi is injected by VS Code
  const vscode = acquireVsCodeApi();
  // The extension sets the language; strings are written in place as tr('English', 'Português').
  const tr = (en, pt) => (document.body.dataset.lang === 'pt-br' ? pt : en);
  const results = /** @type {HTMLElement} */ (document.getElementById('results'));
  const actionButtons = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('button[data-action]'));

  actionButtons.forEach((b) => b.addEventListener('click', () => vscode.postMessage({ type: b.dataset.action })));

  const hintButton = document.getElementById('show-hint');
  if (hintButton) {
    hintButton.addEventListener('click', () => {
      const next = /** @type {HTMLElement | null} */ (document.querySelector('.hint[hidden]'));
      if (next) next.hidden = false;
      if (!document.querySelector('.hint[hidden]')) hintButton.hidden = true;
    });
  }

  // Compiler error lines are links that jump to the code.
  results.addEventListener('click', (e) => {
    const link = /** @type {HTMLElement} */ (e.target).closest('a[data-line]');
    if (!(link instanceof HTMLElement)) return;
    e.preventDefault();
    vscode.postMessage({ type: 'goto', line: Number(link.dataset.line), column: Number(link.dataset.column) });
  });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function normalize(s) {
    return s.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  }

  function setBusy(busy) {
    actionButtons.forEach((b) => {
      if (b.dataset.action === 'run' || b.dataset.action === 'submit') b.disabled = busy;
    });
    const custom = document.getElementById('run-custom');
    if (custom) /** @type {HTMLButtonElement} */ (custom).disabled = busy;
  }

  // ---- Custom input: remembered per challenge across panel reloads.
  const challengeId = document.body.dataset.challenge || '';
  const customBox = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('custom-input'));
  const customResult = /** @type {HTMLElement | null} */ (document.getElementById('custom-result'));
  const state = vscode.getState() || {};
  const saved = state.customInputs || {};
  if (customBox && typeof saved[challengeId] === 'string') customBox.value = saved[challengeId];
  if (customBox) {
    customBox.addEventListener('input', () => {
      saved[challengeId] = customBox.value;
      vscode.setState({ ...state, customInputs: saved });
    });
  }
  const exampleInputs = JSON.parse(document.getElementById('example-inputs')?.textContent || '[]');
  document.querySelectorAll('button[data-example]').forEach((b) =>
    b.addEventListener('click', () => {
      if (!customBox) return;
      customBox.value = exampleInputs[Number(/** @type {HTMLElement} */ (b).dataset.example)] || '';
      customBox.dispatchEvent(new Event('input'));
    }),
  );
  document.getElementById('run-custom')?.addEventListener('click', () => {
    if (!customBox) return;
    let input = customBox.value;
    if (input && !input.endsWith('\n')) input += '\n';
    vscode.postMessage({ type: 'custom', input });
  });

  function renderCustom(o, expected) {
    if (o.kind !== 'tests') return renderOutcome('custom', o);
    const r = o.results[0];
    let status;
    let kind = 'info';
    if (r.timedOut) {
      status = tr('⏱ Time limit exceeded. Is there an infinite loop, or is the program waiting for more input?', '⏱ Tempo limite excedido. Há um laço infinito, ou o programa está esperando mais entrada?');
      kind = 'error';
    } else if (r.exitCode !== 0) {
      status = tr(`✗ Your program crashed (exit code ${r.exitCode}).`, `✗ Seu programa travou (código de saída ${r.exitCode}).`);
      kind = 'error';
    } else if (expected !== undefined) {
      const same = normalize(r.actual) === normalize(expected);
      status = same ? tr('✓ Same output as the example.', '✓ Mesma saída do exemplo.') : tr('✗ Different from the example\'s expected output.', '✗ Diferente da saída esperada do exemplo.');
      kind = same ? 'success' : 'error';
    } else {
      status = tr(`Finished in ${r.timeMs} ms.`, `Terminou em ${r.timeMs} ms.`);
    }
    let body = `<div class="io${expected !== undefined ? '' : ' one'}">${pre(tr('Your output', 'Sua saída'), r.actual, tr('(no output)', '(sem saída)'))}${expected !== undefined ? pre(tr('Expected output (example)', 'Saída esperada (exemplo)'), expected, tr('(nothing)', '(nada)')) : ''}</div>`;
    if (expected !== undefined && !r.timedOut && r.exitCode === 0) {
      const diff = firstDifference(expected, r.actual);
      if (diff) body += `<p class="diff">${diff}</p>`;
    }
    if (r.stderr && r.stderr.trim()) body += `<div class="label">${tr('Error output', 'Saída de erro')}</div><pre class="stderr">${esc(r.stderr.trim())}</pre>`;
    return banner(kind, status, body);
  }

  function banner(kind, title, body) {
    return `<div class="banner ${kind}"><strong>${title}</strong>${body || ''}</div>`;
  }

  function firstDifference(expected, actual) {
    const e = normalize(expected).split('\n');
    const a = normalize(actual).split('\n');
    for (let i = 0; i < Math.max(e.length, a.length); i++) {
      if (e[i] !== a[i]) {
        if (a[i] === undefined) return tr(`Your output is missing line ${i + 1}: expected "${esc(e[i])}".`, `Falta a linha ${i + 1} na sua saída: esperado "${esc(e[i])}".`);
        if (e[i] === undefined) return tr(`Your output has extra line ${i + 1}: "${esc(a[i])}".`, `Sua saída tem uma linha a mais, a ${i + 1}: "${esc(a[i])}".`);
        return tr(`Line ${i + 1} differs — expected "${esc(e[i])}" but got "${esc(a[i])}".`, `A linha ${i + 1} é diferente: esperado "${esc(e[i])}", mas veio "${esc(a[i])}".`);
      }
    }
    return '';
  }

  function pre(label, text, empty) {
    const value = text && text.length ? esc(text.replace(/\n$/, '')) : `<em>${empty}</em>`;
    return `<div><div class="label">${label}</div><pre>${value}</pre></div>`;
  }

  function renderTest(r) {
    const name = (r.hidden ? tr('Hidden test ', 'Teste oculto ') : tr('Test ', 'Teste ')) + (r.index + 1);
    let status = tr('✓ Passed', '✓ Passou');
    if (!r.passed) {
      if (r.timedOut) status = tr('⏱ Time limit exceeded', '⏱ Tempo limite excedido');
      else if (r.exitCode !== 0) status = tr('✗ Runtime error', '✗ Erro de execução');
      else status = tr('✗ Wrong answer', '✗ Resposta errada');
    }

    let body = '';
    if (r.timedOut) {
      body += `<p class="muted">${tr('Your program took too long. Is there an infinite loop, or is it waiting for input that never comes?', 'Seu programa demorou demais. Há um laço infinito, ou ele está esperando uma entrada que nunca chega?')}</p>`;
    }
    if (r.hidden) {
      if (!r.passed) {
        body += `<p class="muted">${tr('The input for this test is hidden. Think about edge cases: zero, negative numbers, the smallest and largest values, empty or repeated values…', 'A entrada deste teste é oculta. Pense nos casos extremos: zero, números negativos, os menores e maiores valores, valores vazios ou repetidos…')}</p>`;
      }
    } else {
      body += `<div class="io three">${pre(tr('Input', 'Entrada'), r.input, tr('(no input)', '(sem entrada)'))}${pre(tr('Expected output', 'Saída esperada'), r.expected, tr('(nothing)', '(nada)'))}${pre(tr('Your output', 'Sua saída'), r.actual, tr('(no output)', '(sem saída)'))}</div>`;
      if (!r.passed && !r.timedOut && r.exitCode === 0) {
        const diff = firstDifference(r.expected, r.actual);
        if (diff) body += `<p class="diff">${diff}</p>`;
      }
    }
    if (r.stderr && r.stderr.trim()) {
      body += `<div class="label">${tr('Error output', 'Saída de erro')}</div><pre class="stderr">${esc(r.stderr.trim())}</pre>`;
    }

    return `<details class="test ${r.passed ? 'pass' : 'fail'}" ${r.passed || !body ? '' : 'open'}>
      <summary><span class="name">${name}</span><span class="status">${status}</span><span class="time">${r.timeMs} ms</span></summary>
      ${body ? `<div class="test-body">${body}</div>` : ''}
    </details>`;
  }

  function renderOutcome(mode, o) {
    switch (o.kind) {
      case 'toolMissing':
        return banner('error', tr('Java not found', 'Java não encontrado'), `<p>${esc(o.message)}</p>`);
      case 'ruleViolation':
        return banner(
          'warning',
          tr('Your code does not meet the requirements yet', 'Seu código ainda não cumpre os requisitos'),
          `<ul>${o.messages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`,
        );
      case 'compileError': {
        const list = o.errors.length
          ? `<ul class="errors">${o.errors
              .map((e) => `<li><a href="#" data-line="${e.line}" data-column="${e.column}">${tr('Line', 'Linha')} ${e.line}</a>: <span>${esc(e.message)}</span></li>`)
              .join('')}</ul>`
          : '';
        const hint = o.hint ? `<p class="compile-hint">💡 ${esc(o.hint)}</p>` : '';
        return banner(
          'error',
          tr('Compilation error', 'Erro de compilação'),
          `${hint}${list}<details><summary>${tr('Full compiler output', 'Saída completa do compilador')}</summary><pre>${esc(o.raw)}</pre></details>`,
        );
      }
      case 'tests': {
        const total = o.results.length;
        const passed = o.results.filter((r) => r.passed).length;
        const all = passed === total;
        let title;
        if (all && mode === 'submit') title = tr('🎉 Accepted! All tests passed.', '🎉 Aceito! Todos os testes passaram.');
        else if (all) title = tr(`All ${total} sample test${total > 1 ? 's' : ''} passed. Now click Submit to run the hidden tests.`, `${total > 1 ? `Os ${total} testes de exemplo passaram` : 'O teste de exemplo passou'}. Agora clique em Enviar para rodar os testes ocultos.`);
        else title = tr(`${passed} / ${total} tests passed`, `${passed} / ${total} testes passaram`);
        return banner(all ? 'success' : 'error', title, '') + o.results.map(renderTest).join('');
      }
      default:
        return '';
    }
  }

  // ---- AI hints: streamed text, rendered with a tiny safe Markdown subset.
  const aiBox = /** @type {HTMLElement | null} */ (document.getElementById('ai-hint'));
  const aiButton = /** @type {HTMLButtonElement | null} */ (document.querySelector('button[data-action="aiHint"]'));
  let aiText = '';
  let aiLabel = '';

  function renderMarkdown(md) {
    const parts = esc(md).split(/```(?:\w+)?\n?/);
    return parts
      .map((part, i) => {
        if (i % 2 === 1) return `<pre><code>${part.replace(/\n$/, '')}</code></pre>`;
        return part
          .replace(/`([^`\n]+)`/g, '<code>$1</code>')
          .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
          .replace(/(^|\n)[-*] (.*)/g, '$1• $2')
          .replace(/\n/g, '<br>');
      })
      .join('');
  }

  function renderAi(state, extra) {
    if (!aiBox) return;
    aiBox.hidden = false;
    const footer = `<div class="ai-footer">${esc(aiLabel)} · ${tr('AI hints can be wrong. Check them against your own reasoning.', 'Dicas de IA podem estar erradas. Confira com o seu próprio raciocínio.')}</div>`;
    if (state === 'error') {
      aiBox.innerHTML = `<div class="ai-title">${tr('✨ AI hint', '✨ Dica da IA')}</div><p class="ai-error">${esc(extra)}</p>`;
    } else {
      const body = aiText ? renderMarkdown(aiText) : '<span class="spinner"></span>Thinking…';
      aiBox.innerHTML = `<div class="ai-title">${tr('✨ AI hint', '✨ Dica da IA')}</div><div class="ai-body">${body}</div>${state === 'done' ? footer : ''}`;
    }
  }

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'aiStart') {
      aiText = '';
      aiLabel = msg.label;
      if (aiButton) aiButton.disabled = true;
      renderAi('streaming');
      aiBox && aiBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (msg.type === 'aiText') {
      aiText += msg.text;
      renderAi('streaming');
      return;
    }
    if (msg.type === 'aiDone' || msg.type === 'aiError') {
      if (aiButton) {
        aiButton.disabled = false;
        aiButton.textContent = tr('✨ Ask AI for another hint', '✨ Pedir outra dica à IA');
      }
      renderAi(msg.type === 'aiDone' ? 'done' : 'error', msg.message);
      return;
    }
    if (msg.type === 'running' && msg.mode === 'custom') {
      setBusy(true);
      if (customResult) customResult.innerHTML = banner('info', `<span class="spinner"></span>${tr('Compiling and running with your input…', 'Compilando e rodando com a sua entrada…')}`, '');
      return;
    }
    if (msg.type === 'customResult') {
      setBusy(false);
      if (customResult) {
        customResult.innerHTML = renderCustom(msg.outcome, msg.expected);
        customResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }
    if (msg.type === 'running') {
      setBusy(true);
      results.innerHTML = banner(
        'info',
        `<span class="spinner"></span>${msg.mode === 'submit' ? tr('Submitting: running all tests…', 'Enviando: rodando todos os testes…') : tr('Compiling and running sample tests…', 'Compilando e rodando os testes de exemplo…')}`,
        '',
      );
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (msg.type === 'result') {
      setBusy(false);
      results.innerHTML = renderOutcome(msg.mode, msg.outcome);
    } else if (msg.type === 'examScore') {
      results.insertAdjacentHTML(
        'afterbegin',
        banner(
          msg.earned >= msg.points ? 'success' : 'warning',
          tr(`This submission: ${msg.earned} / ${msg.points} points`, `Este envio: ${msg.earned} / ${msg.points} pontos`),
          `<p>${tr(`${msg.passed} of ${msg.total} tests passed.`, `${msg.passed} de ${msg.total} testes passaram.`)}</p>`,
        ),
      );
    } else if (msg.type === 'examStatus') {
      const status = document.getElementById('exam-status');
      if (status) status.textContent = msg.text;
      const submit = /** @type {HTMLButtonElement | null} */ (document.querySelector('button[data-action="submit"]'));
      if (submit) {
        submit.textContent = tr(`✔ Submit (${msg.submissionsLeft} left)`, `✔ Enviar (restam ${msg.submissionsLeft})`);
        submit.disabled = msg.submissionsLeft === 0 || msg.finished || !msg.started;
      }
      if (msg.finished) {
        document.querySelectorAll('button[data-action="run"], button[data-action="terminal"], #run-custom').forEach((b) => {
          /** @type {HTMLButtonElement} */ (b).disabled = true;
        });
        const bannerEl = document.getElementById('exam-banner');
        if (bannerEl) bannerEl.className = 'banner success';
      }
    } else if (msg.type === 'solved') {
      const badge = document.getElementById('solved-badge');
      if (badge) badge.hidden = false;
      // Offer the next step of the learning path right in the success banner.
      const success = results.querySelector('.banner.success');
      if (msg.next && success && !success.querySelector('.next-step')) {
        const button = document.createElement('button');
        button.className = 'primary next-step';
        button.textContent = msg.next.quiz ? tr(`Next: quiz · ${msg.next.title} →`, `Próximo: quiz · ${msg.next.title} →`) : tr(`Next: ${msg.next.title} →`, `Próximo: ${msg.next.title} →`);
        button.addEventListener('click', () => vscode.postMessage({ type: 'next' }));
        success.appendChild(button);
      }
    }
  });

  vscode.postMessage({ type: 'ready' });
})();
