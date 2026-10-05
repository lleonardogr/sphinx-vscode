# Digit Statistics

Read a whole number and report on its digits:

```
Digits: 5
Sum: 18
Largest: 7
Even digits: 3
```

That is the output for `40725`: it has 5 digits, they add up to `18`, the largest is `7`, and three of them (`4`, `0`, `2`) are even.

**Input**

A whole number `n` (0 ≤ n ≤ 10¹⁸).

**Output**

The four lines above.

**Things to know**

- `n % 10` is the last digit and `n / 10` removes it. Repeat until the number is gone.
- The number may not fit in an `int`: use `long` and `Long.parseLong`.
- `0` has one digit, `0`, which is even.
- Solve it with arithmetic, without turning the number into a String.
