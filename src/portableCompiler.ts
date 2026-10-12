// A portable C compiler for Windows students who have none: llvm-mingw (clang with the MinGW runtime
// and AddressSanitizer), downloaded from its official GitHub release into Sphinx's own storage after
// the student agrees. The release and its SHA-256 checksums are pinned here; a file that doesn't match
// is thrown away. No vscode dependency, so it can be tested on its own.
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import { Unzip, UnzipInflate, UnzipPassThrough } from 'fflate';
import { exec } from './exec';

export interface PortableCompiler {
  /** The folder it unpacks to, inside Sphinx's compilers folder. */
  folder: string;
  url: string;
  /** Download size, in bytes. */
  size: number;
  sha256: string;
  /** Top-level folders left out: the toolchains for other processors. */
  skip: string[];
}

const RELEASE = '20261006';
const TARGETS = ['x86_64', 'aarch64', 'i686', 'armv7'].map((t) => `${t}-w64-mingw32`);

/** The pinned llvm-mingw for this Windows machine (64-bit Intel/AMD or ARM), or undefined elsewhere. */
export function portableCompilerFor(platform: NodeJS.Platform = process.platform, arch: string = process.arch): PortableCompiler | undefined {
  if (platform !== 'win32') {
    return undefined;
  }
  const host = arch === 'arm64' ? 'aarch64' : arch === 'x64' ? 'x86_64' : undefined;
  if (!host) {
    return undefined;
  }
  const folder = `llvm-mingw-${RELEASE}-ucrt-${host}`;
  const checksums = {
    x86_64: { size: 190836485, sha256: '317492c456aa27ee607a5919f1d2d38dcdc1112516a24d0bf4b00d078f52d17a' },
    aarch64: { size: 185727081, sha256: '9a835d5179c9f3a5a783c11a7f14062a249b4765dd11add64a66786864e82ab2' },
  }[host];
  return {
    folder,
    url: `https://github.com/mstorsjo/llvm-mingw/releases/download/${RELEASE}/${folder}.zip`,
    ...checksums,
    skip: TARGETS.filter((t) => !t.startsWith(`${host}-`)),
  };
}

/** The portable compilers in `root` (each a folder with bin/clang.exe or bin/gcc.exe). */
export function installedPortableCompilers(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => path.join(root, e.name))
    .filter((dir) => ['clang.exe', 'gcc.exe', 'clang', 'gcc'].some((exe) => fs.existsSync(path.join(dir, 'bin', exe))));
}

/**
 * Downloads `url` to `dest` over HTTPS (following redirects), and keeps it only if its SHA-256 is
 * `sha256`. Reports progress as bytes received; `signal` cancels.
 */
export function downloadVerified(
  url: string,
  dest: string,
  sha256: string,
  onProgress?: (received: number, total: number) => void,
  signal?: AbortSignal,
  redirects = 5,
  /** Tests pass the http module to download from a local server; real downloads are HTTPS only. */
  client: typeof https | typeof http = https,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (client === https && !url.startsWith('https://')) {
      reject(new Error(`Refusing to download from a non-HTTPS address: ${url}`));
      return;
    }
    const request = client.get(url, { headers: { 'User-Agent': 'Sphinx (VS Code extension)' }, signal }, (res) => {
      const status = res.statusCode ?? 0;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (redirects <= 0) {
          reject(new Error('Too many redirects'));
          return;
        }
        downloadVerified(new URL(res.headers.location, url).toString(), dest, sha256, onProgress, signal, redirects - 1, client).then(resolve, reject);
        return;
      }
      if (status !== 200) {
        res.resume();
        reject(new Error(`The download failed: HTTP ${status}`));
        return;
      }
      const total = Number(res.headers['content-length'] ?? 0);
      const hash = createHash('sha256');
      const partial = `${dest}.part`;
      const out = fs.createWriteStream(partial);
      let received = 0;
      res.on('data', (chunk: Buffer) => {
        received += chunk.length;
        hash.update(chunk);
        onProgress?.(received, total);
      });
      res.pipe(out);
      const fail = (e: Error) => {
        out.destroy();
        fs.rmSync(partial, { force: true });
        reject(e);
      };
      res.on('error', fail);
      out.on('error', fail);
      out.on('finish', () => {
        const actual = hash.digest('hex');
        if (actual !== sha256.toLowerCase()) {
          fs.rmSync(partial, { force: true });
          reject(new Error(`The downloaded file is not the expected one (SHA-256 ${actual}), so it was deleted.`));
          return;
        }
        fs.renameSync(partial, dest);
        resolve();
      });
    });
    request.on('error', reject);
  });
}

const inside = (child: string, parent: string) => child === parent || child.startsWith(parent + path.sep);

/** Unzips `zip` into `dest` in JavaScript, streaming (the archive is never held in memory), leaving out `skip`. */
export function unzipStreaming(zip: string, dest: string, skip: (name: string) => boolean = () => false): Promise<void> {
  const root = path.resolve(dest);
  return new Promise((resolve, reject) => {
    let failed = false;
    const fail = (e: Error) => {
      if (!failed) {
        failed = true;
        reject(e);
      }
    };
    let open = 0;
    let ended = false;
    const done = () => {
      if (ended && open === 0 && !failed) {
        resolve();
      }
    };
    const unzip = new Unzip((file) => {
      if (failed || skip(file.name)) {
        return;
      }
      const target = path.resolve(root, file.name);
      if (!inside(target, root)) {
        fail(new Error(`The archive contains an unsafe path: ${file.name}`));
        return;
      }
      if (file.name.endsWith('/')) {
        fs.mkdirSync(target, { recursive: true });
        return;
      }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      const fd = fs.openSync(target, 'w');
      open++;
      file.ondata = (err, data, final) => {
        if (err) {
          fs.closeSync(fd);
          fail(err);
          return;
        }
        fs.writeSync(fd, data);
        if (final) {
          fs.closeSync(fd);
          open--;
          done();
        }
      };
      file.start();
    });
    unzip.register(UnzipInflate);
    unzip.register(UnzipPassThrough);
    const input = fs.createReadStream(zip, { highWaterMark: 1 << 20 });
    input.on('data', (chunk) => {
      try {
        unzip.push(chunk as Buffer);
      } catch (e) {
        fail(e as Error);
        input.destroy();
      }
    });
    input.on('error', fail);
    input.on('end', () => {
      try {
        unzip.push(new Uint8Array(0), true);
      } catch (e) {
        fail(e as Error);
        return;
      }
      ended = true;
      done();
    });
  });
}

/**
 * Unzips with the system's tar where it reads zip files (Windows 10+, macOS), which is much faster,
 * and with the JavaScript unzipper otherwise. `skip` lists top-level folders inside the archive's
 * single top folder to leave out.
 */
export async function unzip(zip: string, dest: string, topFolder: string, skip: string[]): Promise<void> {
  fs.mkdirSync(dest, { recursive: true });
  if (process.platform === 'win32' || process.platform === 'darwin') {
    const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    const r = await exec(tar, ['-xf', zip, '-C', dest, ...skip.map((s) => `--exclude=${topFolder}/${s}`)], { cwd: dest, timeoutMs: 30 * 60_000 });
    if (!r.spawnError && r.code === 0) {
      return;
    }
    fs.rmSync(path.join(dest, topFolder), { recursive: true, force: true });
  }
  await unzipStreaming(zip, dest, (name) => skip.some((s) => name.startsWith(`${topFolder}/${s}/`) || name === `${topFolder}/${s}/`));
}

/**
 * Downloads, checks and unpacks `compiler` into `root` (Sphinx's compilers folder), replacing an older
 * copy. Returns its folder. Progress: 'download' with bytes, then 'unpack'.
 */
export async function installPortableCompiler(
  root: string,
  compiler: PortableCompiler,
  onProgress: (step: 'download' | 'unpack', received?: number, total?: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  fs.mkdirSync(root, { recursive: true });
  const zip = path.join(root, `${compiler.folder}.zip`);
  const work = path.join(root, '.unpacking');
  try {
    await downloadVerified(compiler.url, zip, compiler.sha256, (r, t) => onProgress('download', r, t || compiler.size), signal);
    onProgress('unpack');
    fs.rmSync(work, { recursive: true, force: true });
    await unzip(zip, work, compiler.folder, compiler.skip);
    const unpacked = path.join(work, compiler.folder);
    if (!fs.existsSync(path.join(unpacked, 'bin'))) {
      throw new Error('The archive did not contain the expected compiler folder.');
    }
    const final = path.join(root, compiler.folder);
    fs.rmSync(final, { recursive: true, force: true });
    fs.renameSync(unpacked, final);
    return final;
  } finally {
    fs.rmSync(zip, { force: true });
    fs.rmSync(`${zip}.part`, { force: true });
    fs.rmSync(work, { recursive: true, force: true });
  }
}
