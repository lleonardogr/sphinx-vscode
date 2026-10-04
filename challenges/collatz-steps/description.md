# Collatz Steps (while)

Start with a number `n` and repeat:

- if `n` is even, divide it by 2;
- if `n` is odd, replace it with `3 × n + 1`;

until `n` becomes 1. Nobody has proved that this always reaches 1 (it's the famous Collatz conjecture), but it does for every number ever tested.

Print how many **steps** it takes. For example, 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 takes 8 steps.

**Use a `while` loop.** You don't know in advance how many steps there will be, which is exactly what `while` is for.

**Input**

An integer `n` (1 ≤ n ≤ 1,000,000).

**Output**

The number of steps to reach 1.
