# Two's Complement

Read a whole number between −128 and 127 and print how it is stored in **one byte**, using **two's complement**: exactly 8 bits.

Positive numbers are written in binary as usual, with leading zeros: 5 is `00000101`. A negative number is stored as if 256 were added to it: −5 is stored like 251, which is `11111011`. That is the same as inverting every bit of 5 and adding 1.

**Input**

A whole number `n` (−128 ≤ n ≤ 127).

**Output**

The 8 bits that store `n`.

**Things to know**

- In 8 bits, two's complement stores a negative `n` as `n + 256`. Its leftmost bit is always 1; for positive numbers and zero it is 0.
- Write the bits from right to left with `% 2` and `/ 2`, and run the loop exactly 8 times to get the leading zeros.
- Write the bits yourself: `Integer.toBinaryString` isn't allowed here.
