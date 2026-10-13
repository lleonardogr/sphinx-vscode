# Float Anatomy

A `float` is 32 bits in the IEEE 754 format, used by almost every processor:

```
bit 31   | bits 30 … 23 | bits 22 … 0
sign     | exponent     | mantissa (fraction)
```

A normal number is `(−1)^sign × 1.mantissa × 2^(exponent − 127)`. An exponent of 0 means zero or a **subnormal** (a tiny number with no hidden 1), and an exponent of 255 means **infinity** or **nan**. Seeing the bits explains why `0.1` is not exact: its mantissa never ends in binary.

For each number, print its bits and fields:

```
Input: -2.5
Bits: 0xC0200000
Sign: 1
Exponent: 128
Mantissa: 0x200000
Kind: normal, scale 2^1
```

(−2.5 = −1.25 × 2¹, and .25 is binary .01: the mantissa's top bits are `01`.)

**Input**

Numbers, one per line, until the end of the input, as `strtof` reads them: decimals such as `0.1`, scientific notation such as `1e-40`, and `inf` or `-inf`.

**Output**

For each number: `Input:` and the text as read, then `Bits:` (`0x` and 8 hexadecimal digits), `Sign:`, `Exponent:` (the 8-bit field), `Mantissa:` (`0x` and 6 hexadecimal digits) and `Kind:`, which is `zero`, `subnormal`, `infinity`, `nan`, or `normal, scale 2^E` with `E = exponent − 127`.

**Things to know**

- `memcpy(&bits, &f, sizeof bits)` copies the float's bytes into a `uint32_t`. Plain assignment would convert the value instead.
- Masks and shifts take the fields out: `(bits >> 23) & 0xFF` is the exponent.
- `strtof(text, NULL)` converts the text into the nearest `float`.
- `<math.h>` helpers such as `frexp` and `isinf` are not allowed: decode the bits.
