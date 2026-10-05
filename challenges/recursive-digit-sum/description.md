# Recursive Digit Sum

Two recursive methods on the digits of a number:

- `digitSum(n)`: the sum of the digits. `digitSum(9875) = 9 + 8 + 7 + 5 = 29`.
- `digitalRoot(n)`: sum the digits **again and again** until one digit is left. `9875 → 29 → 11 → 2`.

For `9875`:

```
Digit sum: 29
Digital root: 2
```

**Input**

A whole number `n` (0 ≤ n ≤ 10¹⁸).

**Output**

The two lines above.

**Things to know**

- The digit sum of `n` is its last digit (`n % 10`) plus the digit sum of the rest (`n / 10`). A number below 10 is the base case.
- A recursive method can use another one: `digitalRoot` calls `digitSum`, then calls itself.
- Solve it without loops and without turning the number into a String.
