# Count Vowels

Read a line of text and count its **vowels**: `a`, `e`, `i`, `o` and `u`, in lowercase or uppercase. Everything else (other letters, spaces, digits, punctuation) doesn't count. For example, `Hello World` has 3 vowels.

**Input**

One line of text.

**Output**

The number of vowels.

**Things to know**

- `text.length()` is the number of characters, and `text.charAt(i)` is the character at index `i`, starting at 0.
- A `char` is written in single quotes, `'a'`, and compared with `==`.
- `Character.toLowerCase(c)` (or `text.toLowerCase()` first) means you only have to check lowercase vowels.
- `"aeiou".indexOf(c) >= 0` is a short way to ask "is `c` a vowel?".
