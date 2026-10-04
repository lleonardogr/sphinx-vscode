# Caesar Cipher

The Caesar cipher hides a message by shifting every letter forward in the alphabet. With a shift of 3, `A` becomes `D`, `b` becomes `e`, and `z` wraps around to `c`.

Encode a message:

- uppercase letters stay uppercase, and lowercase letters stay lowercase;
- anything that isn't a letter (spaces, digits, punctuation) stays the same.

**Input**

- Line 1: the shift `k` (0 ≤ k ≤ 25)
- Line 2: the message

**Output**

The encoded message.

**Things to know**

- A `char` is a number: `'a' + 1` is `'b'`. Turn the number back into a character with `(char)`.
- Work with the position in the alphabet: `(c - 'a' + k) % 26` wraps `z` around to `a`; then add `'a'` back.
- `Character.isUpperCase(c)` and `Character.isLowerCase(c)` tell you which alphabet to use. Copy anything else as it is.
- Build the result with a `StringBuilder`, then print it.

> This example challenge has AI hints turned off (`"aiHints": false`), the way a teacher might set up an exam question.
