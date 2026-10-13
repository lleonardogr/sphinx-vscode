# Character Codes

To a computer, text is numbers: every character is stored as a code, and `'A'` is 65. In C this is plain to see, because a `char` **is** a small integer, and `printf` can show the same value as a character, in decimal or in hexadecimal.

Read one line and show the code of each of its characters, then a **checksum**: the sum of all the codes, kept to one byte (modulo 256). Checksums like this one detect a character changed in transit.

For `Hi!`:

```
'H'  72 0x48
'i' 105 0x69
'!'  33 0x21
Checksum: 0xD2
```

72 + 105 + 33 = 210, which is `D2` in hexadecimal.

**Input**

One line of text with ASCII characters (letters, digits, spaces and punctuation), possibly empty.

**Output**

One line per character: the character between single quotes, its code in decimal in 3 characters, and its code in hexadecimal with 2 uppercase digits after `0x`. Then `Checksum: ` and the checksum in the same hexadecimal form.

**Things to know**

- `getchar()` returns an `int`: the next character, or `EOF` when the input ends. Keep it in an `int`, not a `char`, so `EOF` can't be confused with a character.
- `%02X` prints in hexadecimal, uppercase, padded with zeros to 2 digits.
- The line ends at `'\n'`, or at `EOF` if there is no newline.
