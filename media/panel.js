// @ts-check
(function () {
  // @ts-ignore acquireVsCodeApi is injected by VS Code
  const vscode = acquireVsCodeApi();
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
  }

  function banner(kind, title, body) {
    return `<div class="banner ${kind}"><strong>${title}</strong>${body || ''}</div>`;
  }

  function firstDifference(expected, actual) {
    const e = normalize(expected).split('\n');
    const a = normalize(actual).split('\n');
    for (let i = 0; i < Math.max(e.length, a.length); i++) {
      if (e[i] !== a[i]) {
        if (a[i] === undefined) return `Your output is missing line ${i + 1}: expected "${esc(e[i])}".`;
        if (e[i] === undefined) return `Your output has extra line ${i + 1}: "${esc(a[i])}".`;
        return `Line ${i + 1} differs — expected "${esc(e[i])}" but got "${esc(a[i])}".`;
      }
    }
    return '';
  }

  function pre(label, text, empty) {
    const value = text && text.length ? esc(text.replace(/\n$/, '')) : `<em>${empty}</em>`;
    return `<div><div class="label">${label}</div><pre>${value}</pre></div>`;
  }

  function renderTest(r) {
    const name = (r.hidden ? 'Hidden test ' : 'Test ') + (r.index + 1);
    let status = '✓ Passed';
    if (!r.passed) {
      if (r.timedOut) status = '⏱ Time limit exceeded';
      else if (r.exitCode !== 0) status = '✗ Runtime error';
      else status = '✗ Wrong answer';
    }

    let body = '';
    if (r.timedOut) {
      body += '<p class="muted">Your program took too long. Is there an infinite loop, or is it waiting for input that never comes?</p>';
    }
    if (r.hidden) {
      if (!r.passed) {
        body += '<p class="muted">The input for this test is hidden. Think about edge cases: zero, negative numbers, the smallest and largest values, empty or repeated values…</p>';
      }
    } else {
      body += `<div class="io three">${pre('Input', r.input, '(no input)')}${pre('Expected output', r.expected, '(nothing)')}${pre('Your output', r.actual, '(no output)')}</div>`;
      if (!r.passed && !r.timedOut && r.exitCode === 0) {
        const diff = firstDifference(r.expected, r.actual);
        if (diff) body += `<p class="diff">${diff}</p>`;
      }
    }
    if (r.stderr && r.stderr.trim()) {
      body += `<div class="label">Error output</div><pre class="stderr">${esc(r.stderr.trim())}</pre>`;
    }

    return `<details class="test ${r.passed ? 'pass' : 'fail'}" ${r.passed || !body ? '' : 'open'}>
      <summary><span class="name">${name}</span><span class="status">${status}</span><span class="time">${r.timeMs} ms</span></summary>
      ${body ? `<div class="test-body">${body}</div>` : ''}
    </details>`;
  }

  function renderOutcome(mode, o) {
    switch (o.kind) {
      case 'toolMissing':
        return banner('error', 'Java not found', `<p>${esc(o.message)}</p>`);
      case 'ruleViolation':
        return banner(
          'warning',
          'Your code does not meet the requirements yet',
          `<ul>${o.messages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`,
        );
      case 'compileError': {
        const list = o.errors.length
          ? `<ul class="errors">${o.errors
              .map((e) => `<li><a href="#" data-line="${e.line}" data-column="${e.column}">Line ${e.line}</a>: <span>${esc(e.message)}</span></li>`)
              .join('')}</ul>`
          : '';
        return banner(
          'error',
          'Compilation error',
          `${list}<details><summary>Full compiler output</summary><pre>${esc(o.raw)}</pre></details>`,
        );
      }
      case 'tests': {
        const total = o.results.length;
        const passed = o.results.filter((r) => r.passed).length;
        const all = passed === total;
        let title;
        if (all && mode === 'submit') title = '🎉 Accepted! All tests passed.';
        else if (all) title = `All ${total} sample test${total > 1 ? 's' : ''} passed. Now click Submit to run the hidden tests.`;
        else title = `${passed} / ${total} tests passed`;
        return banner(all ? 'success' : 'error', title, '') + o.results.map(renderTest).join('');
      }
      default:
        return '';
    }
  }

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'running') {
      setBusy(true);
      results.innerHTML = banner(
        'info',
        `<span class="spinner"></span>${msg.mode === 'submit' ? 'Submitting: running all tests…' : 'Compiling and running sample tests…'}`,
        '',
      );
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (msg.type === 'result') {
      setBusy(false);
      results.innerHTML = renderOutcome(msg.mode, msg.outcome);
    } else if (msg.type === 'solved') {
      const badge = document.getElementById('solved-badge');
      if (badge) badge.hidden = false;
    }
  });

  vscode.postMessage({ type: 'ready' });
})();
