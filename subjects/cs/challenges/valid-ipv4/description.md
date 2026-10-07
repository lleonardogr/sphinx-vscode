# Valid IPv4 Address

Every device on the internet has an **IP address**. An IPv4 address is 4 bytes, written as 4 numbers from 0 to 255 separated by dots, like `192.168.1.1`.

Read a line and say whether it is a valid IPv4 address. It is valid when:

- it has exactly **4 parts** separated by dots;
- each part has **1 to 3 digits** and nothing else;
- each part is a number from **0 to 255**;
- no part has a **leading zero** (`01` is invalid, but `0` is fine).

**Input**

One line of text, without spaces.

**Output**

`Valid` or `Invalid`.

**Things to know**

- `split("\\.")` splits on dots (a plain `"."` would mean "any character" to `split`). Add `-1`, `split("\\.", -1)`, so trailing empty parts aren't dropped.
- `Character.isDigit(c)` tells whether a character is a digit.
- Check the rules yourself: regular expressions and `java.net` classes aren't allowed here.
