import { strict as assert } from 'assert';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as http from 'http';
import { AddressInfo } from 'net';
import * as path from 'path';
import { describe, it } from 'node:test';
import { strToU8, zipSync } from 'fflate';
import { downloadVerified, installedPortableCompilers, portableCompilerFor, unzip, unzipStreaming } from '../../portableCompiler';
import { tempDir } from './helpers';

const sha = (data: Buffer | Uint8Array) => createHash('sha256').update(data).digest('hex');

/** A fake llvm-mingw archive: one top folder with bin/, and toolchains for two processors. */
function fakeArchive(extra: Record<string, Uint8Array> = {}): Uint8Array {
  const top = 'llvm-mingw-test-ucrt-x86_64';
  return zipSync({
    [`${top}/bin/clang.exe`]: strToU8('clang'),
    [`${top}/x86_64-w64-mingw32/bin/libclang_rt.asan_dynamic-x86_64.dll`]: strToU8('asan'),
    [`${top}/aarch64-w64-mingw32/lib/libc.a`]: strToU8('arm'),
    [`${top}/include/stdio.h`]: strToU8('int printf(const char *, ...);'),
    ...extra,
  });
}

describe('portable C compiler', () => {
  it('picks the pinned llvm-mingw for 64-bit and ARM Windows, and nothing elsewhere', () => {
    const x64 = portableCompilerFor('win32', 'x64')!;
    assert.match(x64.url, /^https:\/\/github\.com\/mstorsjo\/llvm-mingw\/releases\/download\/\d+\/llvm-mingw-\d+-ucrt-x86_64\.zip$/);
    assert.match(x64.sha256, /^[0-9a-f]{64}$/);
    assert.ok(x64.size > 100e6);
    assert.ok(!x64.skip.includes('x86_64-w64-mingw32') && x64.skip.includes('aarch64-w64-mingw32'));
    const arm = portableCompilerFor('win32', 'arm64')!;
    assert.match(arm.folder, /ucrt-aarch64$/);
    assert.ok(arm.skip.includes('x86_64-w64-mingw32') && !arm.skip.includes('aarch64-w64-mingw32'));
    assert.notEqual(arm.sha256, x64.sha256);
    assert.equal(portableCompilerFor('darwin', 'arm64'), undefined);
    assert.equal(portableCompilerFor('linux', 'x64'), undefined);
    assert.equal(portableCompilerFor('win32', 'ia32'), undefined);
  });

  it('downloads through redirects, keeps a file with the right checksum and deletes one without', async () => {
    const body = Buffer.from('compiler bytes '.repeat(1000));
    const server = http.createServer((req, res) => {
      if (req.url === '/release') res.writeHead(302, { location: '/files/compiler.zip' }).end();
      else res.writeHead(200, { 'content-length': body.length }).end(body);
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/release`;
    try {
      const dir = tempDir();
      let last = 0;
      await downloadVerified(url, path.join(dir, 'ok.zip'), sha(body), (r) => (last = r), undefined, 5, http);
      assert.deepEqual(fs.readFileSync(path.join(dir, 'ok.zip')), body);
      assert.equal(last, body.length);
      await assert.rejects(downloadVerified(url, path.join(dir, 'bad.zip'), sha(Buffer.from('something else')), undefined, undefined, 5, http), /not the expected one/);
      assert.deepEqual(fs.readdirSync(dir), ['ok.zip'], 'the wrong file and its partial download are gone');
      await assert.rejects(downloadVerified(url, path.join(dir, 'x.zip'), sha(body)), /non-HTTPS/);
    } finally {
      server.close();
    }
  });

  for (const [name, run] of [
    ['in JavaScript', (zip: string, dest: string) => unzipStreaming(zip, dest, (n) => n.startsWith('llvm-mingw-test-ucrt-x86_64/aarch64-w64-mingw32/'))],
    ['with the system tool where it can', (zip: string, dest: string) => unzip(zip, dest, 'llvm-mingw-test-ucrt-x86_64', ['aarch64-w64-mingw32'])],
  ] as const) {
    it(`unpacks ${name}, leaving out the other processors' toolchains`, async () => {
      const dir = tempDir();
      const zip = path.join(dir, 'c.zip');
      fs.writeFileSync(zip, fakeArchive());
      const dest = path.join(dir, 'out');
      await run(zip, dest);
      const top = path.join(dest, 'llvm-mingw-test-ucrt-x86_64');
      assert.equal(fs.readFileSync(path.join(top, 'bin', 'clang.exe'), 'utf8'), 'clang');
      assert.ok(fs.existsSync(path.join(top, 'x86_64-w64-mingw32', 'bin', 'libclang_rt.asan_dynamic-x86_64.dll')));
      assert.ok(fs.existsSync(path.join(top, 'include', 'stdio.h')));
      assert.equal(fs.existsSync(path.join(top, 'aarch64-w64-mingw32')), false);
      assert.deepEqual(installedPortableCompilers(dest), [top]);
    });
  }

  it('refuses an archive that would write outside its folder', async () => {
    const dir = tempDir();
    const zip = path.join(dir, 'evil.zip');
    fs.writeFileSync(zip, fakeArchive({ '../escape.txt': strToU8('x') }));
    await assert.rejects(unzipStreaming(zip, path.join(dir, 'out')), /unsafe path/);
    assert.equal(fs.existsSync(path.join(dir, 'escape.txt')), false);
  });
});
