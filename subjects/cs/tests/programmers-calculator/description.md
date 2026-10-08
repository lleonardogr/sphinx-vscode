# Programmer's Calculator

Open the calculator on Windows or macOS and switch it to **Programmer** mode: it shows the same number in binary, hex and decimal at once, for a chosen size in bits. Programmers use it to read memory, colors and network masks. Build a small one.

The calculator keeps one value, `width` bits wide. It starts with 8 bits and the value 0. Each line is a command:

| Command | What it does |
|---|---|
| `dec N` | sets the value to the decimal number `N`, which can be negative |
| `hex H` | sets the value to the hex number `H` (digits `0`–`9` and `A`–`F`, upper or lower case) |
| `bin B` | sets the value to the binary number `B` |
| `add N` | adds the decimal number `N` |
| `sub N` | subtracts the decimal number `N` |
| `width W` | changes the width to `8`, `16` or `32` bits |
| `quit` | ends the program |

Values always **wrap** to the width: only the lowest `width` bits are kept, as in real hardware. With 8 bits, `dec 300` keeps 300 − 256 = 44, and `dec -1` gives `1111 1111`. The `N` of `add` and `sub` wraps the same way first, so with 8 bits `add -1` adds `1111 1111`.

After each command (except `quit`), print the value the way the calculator shows it:

```
bin 1100 1000 | hex C8 | unsigned 200 | signed -56
```

- `bin`: all `width` bits, in groups of 4 separated by spaces.
- `hex`: `width / 4` digits, upper case, with leading zeros.
- `unsigned`: the bits read as a number from 0 to 2^width − 1.
- `signed`: the bits read in two's complement, from −2^(width−1) to 2^(width−1) − 1.

`add` and `sub` also report the **flags** a CPU sets, at the end of the line:

- ` | carry` (for `add`) or ` | borrow` (for `sub`) when the **unsigned** result doesn't fit: it went above 2^width − 1 or below 0.
- ` | overflow` when the **signed** result doesn't fit. With 8 bits, 100 + 100 overflows, because 200 is more than 127.

When both happen, carry or borrow comes first.

`width` keeps the bits: a wider width adds zeros on the left, a narrower one drops the leftmost bits. So `-56` with 8 bits becomes `200` with 16 bits.

For a wrong command, print the message and leave the value as it was: `Invalid hex` or `Invalid binary` when a digit isn't valid, `Invalid width` for a width other than 8, 16 or 32, and `Unknown command` for anything else.

**Example**

```
dec 100
add 100
add 100
width 16
sub 300
quit
```

prints

```
bin 0110 0100 | hex 64 | unsigned 100 | signed 100
bin 1100 1000 | hex C8 | unsigned 200 | signed -56 | overflow
bin 0010 1100 | hex 2C | unsigned 44 | signed 44 | carry
bin 0000 0000 0010 1100 | hex 002C | unsigned 44 | signed 44
bin 1111 1111 0000 0000 | hex FF00 | unsigned 65280 | signed -256 | borrow
```

The second `add 100` gives 300, which doesn't fit in 8 bits unsigned (carry) and wraps to 44. Read as signed it's −56 + 100 = 44, which fits: no overflow.

**Input**

One command per line, ending with `quit`. Decimal numbers fit in a `long`; hex has at most 16 digits and binary at most 64.

**Output**

One line per command, as above.

**Things to know**

- A `long` holds every 32-bit value, unsigned or signed, so do the math in `long`.
- The lowest `w` bits of `x`: `x & ((1L << w) - 1)`, which also works when `x` is negative.
- `Character.digit(c, 16)` gives the value of a hex digit, or −1 when `c` isn't one.
