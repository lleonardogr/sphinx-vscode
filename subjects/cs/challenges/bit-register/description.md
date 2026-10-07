# 8-bit Register

A processor keeps the numbers it is working on in **registers**. Simulate an 8-bit register that starts at `00000000` and runs a list of commands. Bits are numbered 0 (rightmost) to 7 (leftmost).

| Command | Effect |
|---------|--------|
| `set K` | turn bit K on |
| `clear K` | turn bit K off |
| `toggle K` | flip bit K |
| `shl N` | shift all bits N places to the left (bits that leave on the left are lost) |
| `shr N` | shift all bits N places to the right |
| `not` | flip every bit |
| `end` | stop |

**Input**

One command per line, ending with `end`. K is from 0 to 7 and N from 1 to 7.

**Output**

After each command except `end`, the register as 8 bits. For an unknown command, print `Unknown command: ` followed by the line, and leave the register as it was.

**Things to know**

- `1 << k` is a **mask** with only bit k on. `value | mask` sets it, `value & ~mask` clears it and `value ^ mask` flips it.
- An `int` has 32 bits, so after `shl` or `not` keep only the low 8 with `value & 0xFF`.
- Print the bits yourself, from bit 7 down to bit 0: `Integer.toBinaryString` isn't allowed here.
