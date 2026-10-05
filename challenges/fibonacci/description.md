# Fibonacci (Memoization)

In the **Fibonacci sequence**, each number is the sum of the two before it:

```
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …
```

So `fib(0) = 0`, `fib(1) = 1`, and `fib(n) = fib(n − 1) + fib(n − 2)`. Write `fib` recursively, and make it fast enough for `n = 90`.

**Input**

A whole number `n` (0 ≤ n ≤ 90).

**Output**

`F(10) = 55`

**Things to know**

- The plain recursive version calls `fib(n − 2)` twice, `fib(n − 3)` three times, and so on: for `n = 90` that is more calls than a computer can make in years.
- **Memoization** fixes it: store each answer in an array the first time you compute it, and return the stored value the next time. Then each `fib(k)` is computed once.
- `fib(90)` is about 2.9 × 10¹⁸, so use `long`.
