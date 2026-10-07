# Character Codes

Computers store text as numbers: every character has a **code**. In ASCII, the codes everyone shares, `A` is 65, `a` is 97, the digit `0` is 48 and the space is 32. Java uses the same codes for these characters.

Read a line and print the code of each of its characters.

**Input**

One line of text with 1 to 50 characters: letters without accents, digits, spaces and punctuation. It doesn't start or end with a space.

**Output**

The codes of the characters, in order, separated by spaces.

**Things to know**

- A `char` is a 16-bit number. `(int) c` shows the number: `(int) 'A'` is `65`.
- Upper and lower case letters are 32 apart: `'a' - 'A'` is 32.
- Go through the line with a loop and `charAt`: `getBytes()`, `chars()` and `codePoints()` aren't allowed here.
