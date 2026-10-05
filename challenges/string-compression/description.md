# String Compression

Compress a text by replacing each run of repeated letters with the letter and how many times it repeats. `aaaabbbc` becomes `a4b3c1`.

Compression only helps when the result is **shorter**. If the compressed text is not shorter than the original, print the original instead: `abc` would become `a1b1c1`, so the answer is `abc`.

**Input**

One line with lowercase letters (1 to 1000 of them).

**Output**

The compressed text, or the original if compressing doesn't make it shorter.

**Things to know**

- Adding Strings with `+` in a loop creates a new String every time. A `StringBuilder` grows in place: `sb.append(c).append(count)`.
- A run ends when the next character is different, or when you reach the end of the text. Be careful not to read past the last index.
- Counts can have more than one digit: `aaaaaaaaaaaa` becomes `a12`.
