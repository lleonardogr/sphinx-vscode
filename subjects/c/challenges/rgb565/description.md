# RGB565 Colors

Small screens, from microcontroller displays to old game consoles, store a color in **16 bits** instead of 24: 5 bits of red, 6 of green (the eye is most sensitive to it) and 5 of blue, packed side by side in one number:

```
bit:  15 … 11 | 10 … 5 | 4 … 0
        red   | green  | blue
```

Write both directions. Packing keeps the top bits of each 8-bit channel; unpacking widens each field back to 8 bits by repeating its top bits, so the brightest value becomes 255:

```
pack 255 128 0    →   0xFC00
unpack 0xFC00     →   255 130 0
```

Green came back as 130, not 128: packing lost its lowest 2 bits.

**Input**

Lines until the end of the input: `pack R G B` with three values from 0 to 255, or `unpack 0xHHHH` with a 16-bit value in hexadecimal.

**Output**

For `pack`, the 16-bit color as `0x` and 4 uppercase hexadecimal digits (`printf("0x%04X")`). For `unpack`, the three 8-bit channels.

**Things to know**

- Packing: `((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)`.
- Unpacking: `(value >> 11) & 0x1F` is the red field; a mask of 6 ones, `0x3F`, takes green.
- Widening a 5-bit field `v` to 8 bits: `(v << 3) | (v >> 2)`. For the 6-bit green: `(v << 2) | (v >> 4)`.
- `scanf("%x", &value)` reads hexadecimal, with or without `0x`.
