# Hex Colors

Web pages and design tools write colors in **hexadecimal**: `#FF8800` is orange. After the `#` come three bytes, two hex digits each: **red** `FF` = 255, **green** `88` = 136 and **blue** `00` = 0. The short form `#f80` means the same color: each digit is doubled.

Read a color in hex and print it in the `rgb(…)` form that CSS also understands.

**Input**

One line: `#` followed by 6 hex digits, or by 3 for the short form. Digits can be upper or lower case. The line may also be invalid.

**Output**

`rgb(R, G, B)` with the three values from 0 to 255, or `Invalid color` if the line doesn't start with `#`, doesn't have 3 or 6 digits after it, or has a character that isn't a hex digit.

**Things to know**

- A pair of hex digits is the first digit × 16 + the second: `88` = 8 × 16 + 8 = 136.
- `Character.toUpperCase(c)` lets you treat `a` and `A` alike; `"0123456789ABCDEF".indexOf(c)` gives a digit's value, or −1 for anything else.
- Convert the digits yourself: `Integer.parseInt(text, 16)` isn't allowed here.
