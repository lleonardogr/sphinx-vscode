# Vigenère Cipher

For three centuries the Vigenère cipher was called "the indecipherable cipher". Instead of shifting every letter by the same amount, like Caesar's cipher, it shifts each letter by the next letter of a **key**: `A` shifts by 0, `B` by 1, … `Z` by 25, and the key repeats as long as needed.

```
text   A T T A C K   A T   D A W N
key    L E M O N L   E M   O N L E
       L X F O P V   E F   R N H R
```

`A` + `L` (11) is `L`; `T` + `E` (4) is `X`. Spaces and punctuation are copied as they are, and they don't use up a key letter. Decrypting shifts backwards.

**Input**

Three lines: `encrypt` or `decrypt`; the key (1 to 50 letters, in any case); the text (at most 200 characters).

**Output**

The encrypted or decrypted text. Letters keep their case, everything else stays the same.

**Things to know**

- A string is a `char` array, so you can change `text[i]` in place.
- `isalpha`, `isupper` and `tolower` from `<ctype.h>` test and convert letters. Pass them an `unsigned char`.
- `(c - 'A' + shift) % 26` is the letter's new position in the alphabet.
