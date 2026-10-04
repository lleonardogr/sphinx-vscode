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

**Things to know**

- `while (n != 1) { … steps++; }` repeats until the condition becomes false.
- `n % 2 == 0` tests for even.
- The values can climb far above the starting number: from 837 799 they pass 2.9 billion, more than an `int` can hold (about 2.1 billion). Use a `long` for `n`.
