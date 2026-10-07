// @ts-check
// Lesson panel: "Mark as read", the button to the next item in the learning path, and the reading cards.
(function () {
  // @ts-ignore acquireVsCodeApi is injected by VS Code
  const vscode = acquireVsCodeApi();
  const done = document.getElementById('done');
  const next = document.getElementById('next');
  done?.addEventListener('click', () => vscode.postMessage({ type: 'done' }));
  next?.addEventListener('click', () => vscode.postMessage({ type: 'next' }));
  // Reading cards: the extension opens the reading in the browser.
  document.querySelectorAll('[data-open]').forEach((button) =>
    button.addEventListener('click', () => vscode.postMessage({ type: 'open', index: Number(button.getAttribute('data-open')) })),
  );
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'read') {
      done?.setAttribute('hidden', '');
      document.getElementById('read-badge')?.removeAttribute('hidden');
      next?.classList.replace('secondary', 'primary');
    }
  });
})();
