## Why it matters

The gates from the last lesson also work on **whole numbers at once**: Java can apply AND, OR or XOR to all 32 bits of two `int`s in a single step. These **bitwise operations** are how programs pack many yes/no flags into one number, read colors and file permissions, and do some calculations very fast.

## The operators

| Operator | Name | What it does to each pair of bits |
|----------|------|-----------------------------------|
| `a & b` | AND | 1 only where both are 1 |
| `a \| b` | OR | 1 where at least one is 1 |
| `a ^ b` | XOR | 1 where they differ |
| `~a` | NOT | flips every bit |
| `a << n` | shift left | moves the bits n places to the left |
| `a >> n` | shift right | moves the bits n places to the right |

Take 12 (`1100`) and 10 (`1010`):

| | Bits | Value |
|---|------|-------|
| `12 & 10` | `1000` | 8 |
| `12 \| 10` | `1110` | 14 |
| `12 ^ 10` | `0110` | 6 |

Note the difference from `&&` and `||`: those work on booleans, while `&`, `|` and `^` work bit by bit on numbers.

## Shifting

Shifting left by 1 adds a 0 on the right, which **doubles** the number, just as adding a 0 in decimal multiplies by 10: `5 << 1` is 10 and `1 << 4` is 16. Shifting right by 1 **halves** it, dropping the last bit: `13 >> 1` is 6.

For negative numbers, `>>` copies the sign bit, so `-16 >> 2` is −4. `>>>` shifts in zeros instead.

## Masks: working with single bits

A **mask** is a number with only the bits you care about turned on. `1 << k` is a mask for bit k (bits are numbered from 0 on the right):

| Task | Code |
|------|------|
| Is bit k on? | `(n >> k) & 1` or `(n & (1 << k)) != 0` |
| Turn bit k on | `n \| (1 << k)` |
| Turn bit k off | `n & ~(1 << k)` |
| Flip bit k | `n ^ (1 << k)` |
| Keep only the last 8 bits | `n & 0xFF` |

A handy one: `n & 1` is 1 for odd numbers and 0 for even ones.

## Flags in real life

File permissions on Linux and macOS are bit flags: read = 4 (`100`), write = 2 (`010`), execute = 1 (`001`). Permission 6 is `110`, read and write. To give execute permission you OR it in: `6 | 1 = 7`.

Colors work the same way. `0xFF8800` holds red, green and blue in one `int`, and you can take them apart with shifts and masks:

```java
int color = 0xFF8800;
int red   = (color >> 16) & 0xFF;  // 255
int green = (color >> 8) & 0xFF;   // 136
int blue  = color & 0xFF;          // 0
```

## Summary

- `&`, `|`, `^` and `~` apply AND, OR, XOR and NOT to every bit of a number.
- `<<` doubles for each place shifted, `>>` halves.
- A mask such as `1 << k` selects bits: `&` tests or clears them, `|` sets them, `^` flips them.
- Permissions and colors pack several values into one number's bits.
