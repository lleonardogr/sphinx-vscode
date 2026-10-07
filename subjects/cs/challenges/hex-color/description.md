# Hex Colors

Web pages and design tools write colors in **hexadecimal**: `#FF8800` is orange. After the `#` come three bytes, two hex digits each: **red** `FF` = 255, **green** `88` = 136, **blue** `00` = 0. The short form `#f80` means the same color: each digit is doubled.

Designers also need to know whether text on that color should be **black or white** to be readable. Our eyes are most sensitive to green and least to blue, so the perceived **brightness** weighs the three colors differently:

> brightness = 0.299 × R + 0.587 × G + 0.114 × B

For orange: 0.299 × 255 + 0.587 × 136 + 0.114 × 0 ≈ **156**. Colors with a brightness of **128 or more** are light, so black text reads well on them; darker colors need white text.

**Input**

One line: `#` followed by 6 hex digits, or 3 for the short form, in upper or lower case. The line may also be invalid.

**Output**

Three lines: `rgb(R, G, B)`, then `Brightness: ` and the brightness rounded to a whole number, then `Text: black` or `Text: white`. If the line doesn't start with `#`, doesn't have 3 or 6 digits after it, or has a character that isn't a hex digit, print only `Invalid color`.

**Things to know**

- A pair of hex digits is the first digit × 16 + the second: `88` = 8 × 16 + 8 = 136.
- To round with whole numbers only: `(299 * r + 587 * g + 114 * b + 500) / 1000`.
- Convert the digits yourself: `Integer.parseInt(text, 16)` isn't allowed here.
