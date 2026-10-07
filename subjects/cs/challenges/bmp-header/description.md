# Read a BMP Header

Files start with a **header**: a few bytes saying what kind of file it is and how to read it. A **BMP** image starts like this:

| Bytes | Meaning |
|-------|---------|
| 0–1 | the letters `BM` (`42 4D` in hex) |
| 2–5 | the file size in bytes |
| 18–21 | the width in pixels |
| 22–25 | the height in pixels |
| 28–29 | the bits per pixel |

Numbers that take several bytes are stored **little-endian**: the **least** significant byte comes first. The width bytes `80 02 00 00` mean 0x00000280 = **640**, not 0x80020000. Intel and ARM processors work the same way, while network protocols send the most significant byte first (big-endian).

Read the first 30 bytes of a file and describe the image.

**Input**

One line with 30 bytes in hex (two upper-case digits each), separated by spaces.

**Output**

Five lines: `Format: BMP`, then `Width: `, `Height: ` and `Bits per pixel: ` with their values, then `File size: N bytes`. If the file doesn't start with `BM`, print only `Not a BMP file`.

**Things to know**

- `Integer.parseInt("4E", 16)` reads one byte.
- Little-endian: bytes b0 b1 b2 b3 are b0 + b1 × 256 + b2 × 256² + b3 × 256³. Use `long` for the file size.
- Read the bytes yourself: `ByteBuffer` and image libraries aren't allowed here.
