# Factorial

The factorial of `n` (written `n!`) is the product of all whole numbers from 1 to `n`:

```
5! = 1 × 2 × 3 × 4 × 5 = 120
```

By definition, `0! = 1`.

**Input**

An integer `n` (0 ≤ n ≤ 20).

**Output**

The value of `n!`.

**Things to know**

- Start the product at `1` (not `0`), then multiply by each number: `result *= i;`
- Factorials grow fast: `13!` is already too big for an `int`. Use a `long`, which holds up to about 9 × 10¹⁸, enough for `20!`.
- A loop from 1 to 0 runs zero times, so `0!` stays `1` with no special case.
