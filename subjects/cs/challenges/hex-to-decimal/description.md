# Hex to Decimal

Read a number in **hexadecimal** (base 16) and print its value in **decimal**.

Hex digits go from `0` to `9` and then `A` (10) to `F` (15), in upper or lower case. Each digit is worth 16 times the digit to its right: `2F` is 2 × 16 + 15 = **47**.

The number may start with `0x` or `0X`, as in code. If a character isn't a hex digit, print `Invalid hex digit: ` followed by the **first** such character, as it was typed.

**Input**

A hexadecimal number with 1 to 15 digits, optionally starting with `0x` or `0X`.

**Output**

Its value in decimal, or `Invalid hex digit: G`.

**Things to know**

- `"0123456789ABCDEF".indexOf(Character.toUpperCase(c))` gives the value of a hex digit, or `-1` when `c` isn't one.
- Going from left to right, `value = value * 16 + digit` builds the number one digit at a time.
- 15 hex digits don't fit in an `int`: use a `long`. Do the conversion yourself: `Long.parseLong(text, 16)` isn't allowed here.
