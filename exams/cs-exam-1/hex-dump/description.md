# Hex Dump

When a file won't open, programmers look at its bytes with a **hex dump**, made by tools like `xxd` and `hexdump`. Each line shows 16 bytes in hex, and next to them the same bytes as text, so you can spot both numbers and words:

```
0000  48 69 20 53 70 68 69 6E 78 0A                    Hi Sphinx.
```

Read some bytes and print their hex dump. Each line has:

1. the **offset**: the position of the line's first byte, as 4 upper-case hex digits (`0000`, `0010`, `0020`…);
2. two spaces;
3. up to 16 bytes as 2-digit upper-case hex, separated by one space. This part is always **47 characters** wide: on a short last line, fill the rest with spaces;
4. two spaces;
5. the same bytes as text: bytes 32 to 126 as their ASCII character, and any other byte as `.`.

**Input**

The count `n` (1 to 100), then a line with `n` bytes in decimal (0 to 255), separated by spaces.

**Output**

One line per 16 bytes, as above.

**Things to know**

- The byte 72 is `48` in hex (4 × 16 + 8) and the letter `H` in ASCII; `(char) 72` gives `'H'`.
- 16 bytes take 16 × 3 − 1 = 47 characters in the hex part.
