# Title Case

Rewrite a sentence in **title case**: the first letter of every word in uppercase and the rest in lowercase.

`the qUICK BROWN fox` becomes `The Quick Brown Fox`.

**Input**

One line with one or more words made of letters, separated by single spaces.

**Output**

The same words in title case, separated by single spaces.

**Things to know**

- `substring(0, 1)` is the first letter and `substring(1)` is everything after it.
- `toUpperCase()` and `toLowerCase()` return a new String; the original doesn't change.
- `String.join(" ", parts)` joins an array of Strings with a space between each.
