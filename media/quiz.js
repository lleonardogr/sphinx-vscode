// @ts-check
// Quiz panel: collects answers and shows feedback. Grading happens in the extension, so the
// correct answers are never in this page until a practice check reveals them.
(function () {
  // @ts-ignore acquireVsCodeApi is injected by VS Code
  const vscode = acquireVsCodeApi();
  const tr = (en, pt) => (document.body.dataset.lang === 'pt-br' ? pt : en);
  const practice = document.body.dataset.mode === 'practice';
  const questions = /** @type {HTMLElement[]} */ (Array.from(document.querySelectorAll('.quiz-question')));

  /** @param {HTMLElement} q */
  function answerOf(q) {
    const kind = q.dataset.kind;
    if (kind === 'one' || kind === 'many') {
      const picked = Array.from(q.querySelectorAll('input:checked')).map((i) => Number(/** @type {HTMLInputElement} */ (i).value));
      return picked.length ? picked : null;
    }
    if (kind === 'bool') {
      const picked = /** @type {HTMLInputElement | null} */ (q.querySelector('input:checked'));
      return picked ? picked.value === 'true' : null;
    }
    const text = /** @type {HTMLInputElement | HTMLTextAreaElement} */ (q.querySelector('.quiz-text')).value;
    return text.trim() ? text : null;
  }

  const allAnswers = () => questions.map(answerOf);

  function setLocked(locked) {
    document.querySelectorAll('input, textarea, button[data-check], #check-all, #submit-quiz').forEach((el) => {
      /** @type {HTMLInputElement} */ (el).disabled = locked;
    });
  }
  if (document.body.dataset.locked) setLocked(true);

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** @param {number} index @param {{ correct: boolean, answer?: string, explanation?: string }} r */
  function showFeedback(index, r) {
    const el = document.getElementById(`feedback-${index}`);
    const q = questions[index];
    if (!el || !q) return;
    q.classList.toggle('correct', r.correct);
    q.classList.toggle('wrong', !r.correct);
    el.innerHTML = `<div class="banner ${r.correct ? 'success' : 'error'}"><strong>${r.correct ? tr('✓ Correct', '✓ Certo') : tr('✗ Not quite', '✗ Não exatamente')}</strong>
      ${!r.correct && r.answer !== undefined ? `<p>${tr('Correct answer', 'Resposta certa')}: <code class="quiz-pre">${escapeHtml(r.answer)}</code></p>` : ''}
      ${r.explanation ? `<div class="quiz-explanation">${r.explanation}</div>` : ''}</div>`;
  }

  // Practice: check one question, or all of them.
  document.querySelectorAll('button[data-check]').forEach((b) =>
    b.addEventListener('click', () => {
      const index = Number(/** @type {HTMLElement} */ (b).dataset.check);
      vscode.postMessage({ type: 'check', index, answer: answerOf(questions[index]) });
    }),
  );
  document.getElementById('check-all')?.addEventListener('click', () => vscode.postMessage({ type: 'checkAll', answers: allAnswers() }));
  document.getElementById('start-over')?.addEventListener('click', () => {
    questions.forEach((q, i) => {
      q.classList.remove('correct', 'wrong');
      q.querySelectorAll('input[type=radio], input[type=checkbox]').forEach((i) => (/** @type {HTMLInputElement} */ (i).checked = false));
      q.querySelectorAll('.quiz-text').forEach((t) => (/** @type {HTMLInputElement} */ (t).value = ''));
      const fb = document.getElementById(`feedback-${i}`);
      if (fb) fb.innerHTML = '';
    });
    const score = document.getElementById('quiz-score');
    if (score) score.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Exam: save answers as the student goes, so they are auto-submitted when time runs out.
  let saveTimer;
  if (!practice) {
    document.querySelector('main')?.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => vscode.postMessage({ type: 'save', answers: allAnswers() }), 400);
    });
    document.getElementById('submit-quiz')?.addEventListener('click', () => {
      clearTimeout(saveTimer);
      vscode.postMessage({ type: 'submit', answers: allAnswers() });
    });
  }

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'feedback') {
      showFeedback(msg.index, msg);
    } else if (msg.type === 'graded') {
      msg.results.forEach((r, i) => showFeedback(i, r));
      const score = document.getElementById('quiz-score');
      if (score) {
        const all = msg.correct === msg.results.length;
        score.innerHTML = `<div class="banner ${all ? 'success' : msg.correct ? 'warning' : 'error'}"><strong>${all ? '🎉 ' : ''}${tr(`${msg.correct} of ${msg.results.length} correct · ${msg.earned} / ${msg.total} points`, `${msg.correct} de ${msg.results.length} certas · ${msg.earned} / ${msg.total} pontos`)}</strong>
          ${all ? '' : `<p>${tr('Read the explanations, then click Start over to try again.', 'Leia as explicações e clique em Recomeçar para tentar de novo.')}</p>`}</div>`;
        score.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (msg.type === 'examStatus') {
      const status = document.getElementById('exam-status');
      if (status) status.textContent = msg.text;
      if (msg.locked) setLocked(true);
      const banner = document.getElementById('exam-banner');
      if (banner && msg.locked) banner.className = 'banner success';
      if (msg.score) {
        const score = document.getElementById('quiz-score');
        if (score) score.innerHTML = `<div class="banner info"><strong>${tr('Quiz submitted', 'Quiz enviado')}: ${msg.score}</strong></div>`;
      }
    }
  });

  vscode.postMessage({ type: 'ready' });
})();
