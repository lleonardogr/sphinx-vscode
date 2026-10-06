// @ts-check
// Class results dashboard: column sorting, and the Export CSV / Verify all buttons.
(function () {
  // @ts-ignore acquireVsCodeApi is injected by VS Code
  const vscode = acquireVsCodeApi();
  const tr = (en, pt) => (document.body.dataset.lang === 'pt-br' ? pt : en);
  const table = /** @type {HTMLTableElement | null} */ (document.getElementById('results'));

  document.getElementById('export')?.addEventListener('click', () => vscode.postMessage({ type: 'exportCsv' }));
  document.getElementById('verify')?.addEventListener('click', () => vscode.postMessage({ type: 'verify' }));

  if (table) {
    const headers = Array.from(table.tHead?.rows[0].cells ?? []);
    headers.forEach((th, col) =>
      th.addEventListener('click', () => {
        const desc = !th.classList.contains('sorted-desc') && th.classList.contains('sorted-asc');
        headers.forEach((h) => h.classList.remove('sorted-asc', 'sorted-desc'));
        th.classList.add(desc ? 'sorted-desc' : 'sorted-asc');
        const numeric = th.dataset.type === 'num';
        const body = table.tBodies[0];
        const rows = Array.from(body.rows);
        rows.sort((a, b) => {
          const x = a.cells[col].dataset.sort ?? '';
          const y = b.cells[col].dataset.sort ?? '';
          const c = numeric ? Number(x) - Number(y) : x.localeCompare(y);
          return desc ? -c : c;
        });
        rows.forEach((r) => body.appendChild(r));
      }),
    );
    table.addEventListener('click', (e) => {
      const link = /** @type {HTMLElement} */ (e.target).closest('a.open');
      if (link) {
        e.preventDefault();
        vscode.postMessage({ type: 'open', file: link.closest('tr')?.dataset.file });
      }
    });
  }

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!table) return;
    if (msg.type === 'verifying') {
      table.querySelectorAll('td.verified').forEach((td) => (td.textContent = '…'));
    } else if (msg.type === 'verified') {
      for (const r of msg.results) {
        const row = Array.from(table.tBodies[0].rows).find((tr) => tr.dataset.file === r.file);
        const td = row?.querySelector('td.verified');
        if (!td) continue;
        td.classList.remove('ok', 'bad');
        if (r.error) {
          td.textContent = tr('Error', 'Erro');
          td.setAttribute('title', r.error);
          td.classList.add('bad');
        } else if (r.matches) {
          td.textContent = '✓';
          td.setAttribute('title', tr('The score matches a re-grade of the code in the file.', 'A nota confere com a recorreção do código do arquivo.'));
          td.classList.add('ok');
        } else {
          td.textContent = `⚠ ${r.recomputed}`;
          td.setAttribute('title', tr(`The score in the file does not match a re-grade of its code, which gives ${r.recomputed}.`, `A nota do arquivo não confere com a recorreção do código dele, que dá ${r.recomputed}.`));
          td.classList.add('bad');
        }
        /** @type {HTMLElement} */ (td).dataset.sort = r.error ? '2' : r.matches ? '0' : '1';
      }
    }
  });
})();
