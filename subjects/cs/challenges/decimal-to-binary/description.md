# Decimal to Binary

Read a number in **decimal** and print it in **binary**.

Divide by 2 repeatedly and write down the remainders. Reading the remainders from the **last** to the first gives the binary number. For 13: 13 ÷ 2 = 6 remainder **1**, 6 ÷ 2 = 3 r **0**, 3 ÷ 2 = 1 r **1**, 1 ÷ 2 = 0 r **1**, so 13 is **1101**.

**Input**

A whole number `n` (0 ≤ n ≤ 1,000,000,000).

**Output**

`n` in binary, without leading zeros (`0` for zero).

**Things to know**

- `n % 2` is the remainder (the next bit) and `n / 2` is the quotient (what is left).
- The first remainder you get is the **rightmost** bit, so add each new bit to the **front** of the text: `bits = (n % 2) + bits;`
- Do the conversion yourself: `Integer.toBinaryString(n)` isn't allowed here.
