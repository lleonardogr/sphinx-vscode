# Run-Length Encoding

Images often have long runs of the same color, like a white background. **Run-length encoding** (RLE) stores each run as a **count** and a **value**: `WWWWWWWWWWWWB` becomes `12W1B`. It is **lossless**: decoding gives back exactly the original. Fax machines, the BMP and TIFF image formats, and many other tools use it.

Write an encoder and a decoder for text made of upper-case letters.

**Input**

Two lines. The first is `encode` or `decode`. The second is the text to encode (1 to 100 letters `A` to `Z`), or a code to decode: runs written as a count followed by a letter, such as `4A3B2C1D`.

**Output**

Two lines: the result, then `Length: ` with the length before and after, as `10 -> 8`. If a code to decode is invalid (it ends with digits, a letter has no count, or a count is 0), print only `Invalid code`.

**Things to know**

- RLE only helps when there are runs: `ABCDEF` becomes `1A1B1C1D1E1F`, twice as long. Real formats add tricks to avoid that.
- A count can have several digits: `12W` is twelve Ws.
- Build the output with a `StringBuilder`; regular expressions and `java.util.zip` aren't allowed here.
