#!/usr/bin/env node
// CI check (Windows): installs the pinned portable C compiler with Sphinx's own code, then makes sure
// Sphinx picks it with memory checks and explains a memory error with its line.
//   node scripts/check-portable-compiler.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const { installPortableCompiler, installedPortableCompilers, portableCompilerFor } = require('../out/portableCompiler');
const { findCCompiler } = require('../out/cRunner');
const { runChallengeCode } = require('../out/runner');

function size(dir) {
  let bytes = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    bytes += e.isDirectory() ? size(p) : fs.statSync(p).size;
  }
  return bytes;
}

(async () => {
  const compiler = portableCompilerFor();
  if (!compiler) {
    console.log('No portable compiler for this system; nothing to check.');
    return;
  }
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-compilers-'));
  const start = Date.now();
  let last = -1;
  const folder = await installPortableCompiler(root, compiler, (step, received, total) => {
    const percent = step === 'download' ? Math.floor((received / total) * 10) * 10 : 100;
    if (percent !== last) {
      console.log(step === 'download' ? `downloading ${percent}%` : 'unpacking');
      last = percent;
    }
  });
  console.log(`installed ${folder} in ${Math.round((Date.now() - start) / 1000)} s, ${Math.round(size(folder) / 1048576)} MB on disk`);

  const found = await findCCompiler(undefined, installedPortableCompilers(root));
  console.log('found:', found);
  if (!found || !path.resolve(found.command).startsWith(path.resolve(folder))) throw new Error('Sphinx did not pick the portable compiler');
  if (!found.sanitizers) throw new Error('The portable compiler has no memory checks');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-c-'));
  const file = path.join(dir, 'main.c');
  fs.writeFileSync(file, '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *squares = malloc(n * sizeof *squares);\n    for (int i = 0; i <= n; i++) {\n        squares[i] = i * i;\n    }\n    printf("%d\\n", squares[0]);\n    free(squares);\n    return 0;\n}\n');
  const outcome = await runChallengeCode({ file, tests: [{ input: '', output: '0\n' }], cPortableDirs: installedPortableCompilers(root) });
  const crash = outcome.kind === 'tests' ? outcome.results[0].crash : undefined;
  console.log('explanation:', crash);
  if (crash !== 'Line 8: your program went past the end of memory from malloc (allocated at line 6).') throw new Error(`Unexpected outcome: ${JSON.stringify(outcome).slice(0, 2000)}`);
  console.log('The portable C compiler works, with memory checks.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
