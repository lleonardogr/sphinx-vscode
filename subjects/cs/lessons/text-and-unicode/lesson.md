## Why it matters

A computer only stores numbers, yet you read text, emoji and accented letters on it all day. Text works because everyone agrees on a table that gives each character a number. Knowing that table explains tricks such as `'a' - 'A'`, and garbled text like "PortuguÃªs" where "Português" should be.

## Characters are numbers

The first widely shared table was **ASCII** (1963). It has 128 codes, from 0 to 127, enough for English:

| Characters | Codes |
|------------|-------|
| space | 32 |
| `0` to `9` | 48 to 57 |
| `A` to `Z` | 65 to 90 |
| `a` to `z` | 97 to 122 |

There is a pattern: each lower-case letter is exactly **32** after its upper-case letter, and the digit `7` is 48 + 7. Codes below 32 aren't printable: 10 is the new-line character.

In Java a `char` is a number, so you can do arithmetic with it:

```java
IO.println((int) 'A');       // 65
IO.println((char) 66);       // B
IO.println('a' - 'A');       // 32
IO.println((char) ('c' - 32)); // C: lower to upper case
```

## Beyond English: Unicode

128 codes have no room for é, ç, ã, Greek, Arabic, Chinese or emoji. For years every region used its own table, and a file written with one table looked garbled when read with another.

**Unicode** fixed this with one huge table for every writing system: more than 150,000 characters so far, each with a **code point** written in hex, such as `U+0041` (A), `U+00E9` (é), `U+20AC` (€) and `U+1F600` (😀). The first 128 code points are exactly ASCII.

## UTF-8: storing code points as bytes

Code points go up to `U+10FFFF`, which needs 21 bits. Using 4 bytes for every character would waste space, so most files use **UTF-8**, which takes 1 to 4 bytes:

| Code points | Bytes | Examples |
|-------------|-------|----------|
| U+0000 to U+007F | 1 | A, 7, ? |
| U+0080 to U+07FF | 2 | é, ç, ã, ñ |
| U+0800 to U+FFFF | 3 | €, most Chinese characters |
| U+10000 to U+10FFFF | 4 | 😀 and other emoji |

English text stays exactly as small as in ASCII, and any ASCII file is already valid UTF-8. Accented letters take 2 bytes: "Olá" has 3 characters but 4 bytes.

When a program reads UTF-8 bytes as if each byte were one character, é (bytes `C3 A9`) shows up as "Ã©". That is the garbled text you sometimes see: the bytes are right, the table used to read them is wrong.

## Text in Java

A Java `char` has 16 bits, enough for code points up to `U+FFFF`. Characters beyond that, like most emoji, take **two** `char`s, so `"😀".length()` is 2. For everyday text with letters, digits and accents, one `char` is one character.

## Summary

- Every character has a number: ASCII gives `A` = 65, `a` = 97, `0` = 48, space = 32.
- Unicode numbers every character of every language, written like `U+00E9`.
- UTF-8 stores a code point in 1 to 4 bytes; ASCII characters take 1, accented letters 2.
- Garbled text means bytes were read with the wrong table.
