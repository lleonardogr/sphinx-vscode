# Bit Checker

Read a number `n` and a position `k`, and print whether bit `k` of `n` is 1.

Bits are numbered from the **right**, starting at **0**. 13 is `1101` in binary: bit 0 is 1, bit 1 is 0, bit 2 is 1 and bit 3 is 1.

**Input**

One line with two whole numbers: `n` (0 ≤ n ≤ 2,147,483,647) and `k` (0 ≤ k ≤ 30).

**Output**

`Bit k of n is 1` or `Bit k of n is 0`, with the numbers filled in.

**Things to know**

- `n >> k` shifts the bits of `n` to the right by `k` places, so bit `k` ends up at position 0.
- `x & 1` keeps only the rightmost bit of `x`: it is 1 or 0.
- Work with the bits directly: methods that turn `n` into binary text aren't allowed here.
