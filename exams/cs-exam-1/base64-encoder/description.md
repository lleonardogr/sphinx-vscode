# Base64 Encoder

Email, web pages and JSON were made for text, not for raw bytes. To send an image or a file through them, the bytes are written as **Base64**: text with only 64 safe characters. You see it in email attachments, in `data:` URLs and inside login tokens.

The 64 characters are, in order of their value from 0 to 63:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
```

To encode, take the bytes **3 at a time**. 3 bytes are 24 bits, which split into **four groups of 6 bits**, and each group (0 to 63) becomes one character. For `Man`:

| | `M` | `a` | `n` |
|---|---|---|---|
| ASCII | 77 | 97 | 110 |
| Bits | `01001101` | `01100001` | `01101110` |

The 24 bits `010011 010110 000101 101110` are 19, 22, 5 and 46: **`TWFu`**.

If 1 or 2 bytes are left over at the end, add zero bits to complete the last 6-bit group, and pad with `=` so the output length is a multiple of 4: `Ma` is `TWE=` and `M` is `TQ==`.

Read a line of text and print it in Base64.

**Input**

One line of ASCII text, at least 1 character long.

**Output**

The Base64 encoding of the text's bytes.

**Things to know**

- A character's ASCII code is its `char` value: `(int) 'M'` is 77.
- `x >> 6` drops the lowest 6 bits of `x`, and `x & 63` keeps only them.
