# Case Flipper

Computers store every character as a number, its **code**. In ASCII, the codes shared by almost every system, the upper-case letters `A` to `Z` are **65 to 90** and the lower-case letters `a` to `z` are **97 to 122**. Each lower-case letter is exactly **32** after its upper-case letter, so changing the case is just adding or subtracting 32.

Read a line and swap the case of every letter.

**Input**

One line of text with 1 to 80 characters: letters without accents, digits, spaces and punctuation.

**Output**

The same line with every upper-case letter turned into lower case and every lower-case letter into upper case. Everything else stays the same.

**Things to know**

- In Java a `char` is a number: `'a' - 'A'` is `32`, and `(char) ('c' - 32)` is `'C'`.
- Check the range before changing a character: `[`, `` ` ``, `@` and `{` are right next to the letters but aren't letters.
- Use the codes: `toUpperCase`, `toLowerCase` and `isUpperCase` aren't allowed here.
