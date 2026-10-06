# UTF-8 Encoder

**Unicode** gives every character in every language a number, its **code point**, written like `U+00E9` (é) or `U+1F600` (😀). **UTF-8** is how most files and web pages store those numbers: common characters take 1 byte, others 2, 3 or 4.

| Code point | Bytes | Bit pattern |
|------------|-------|-------------|
| U+0000 to U+007F | 1 | `0xxxxxxx` |
| U+0080 to U+07FF | 2 | `110xxxxx 10xxxxxx` |
| U+0800 to U+FFFF | 3 | `1110xxxx 10xxxxxx 10xxxxxx` |
| U+10000 to U+10FFFF | 4 | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

The `x`s are the bits of the code point, filled in from the right. For é, U+00E9 = 233 = `00011 101001`, so the bytes are `110 00011` = **C3** and `10 101001` = **A9**.

Read a code point and print its UTF-8 bytes.

**Input**

`U+` followed by 4 to 6 hex digits (upper case), from U+0000 to U+10FFFF.

**Output**

The bytes in hex, two upper-case digits each, separated by spaces.

**Things to know**

- `Integer.parseInt(text.substring(2), 16)` reads the code point.
- Each continuation byte holds 6 bits: `0x80 + code % 64`, then `code /= 64`. The first byte gets the marker (`0xC0`, `0xE0` or `0xF0`) plus the bits that are left.
- Build the bytes yourself: `getBytes` and other library encoders aren't allowed here.
