# Recursive Factorial

A **recursive** method solves a problem by calling **itself** on a smaller version of it. The factorial is the classic example:

- `0! = 1`
- `n! = n × (n − 1)!`

So `5! = 5 × 4! = 5 × 4 × 3! = … = 120`. Write `factorial` this way, without loops.

**Input**

A whole number `n` (0 ≤ n ≤ 20).

**Output**

`5! = 120`

**Things to know**

- The **base case** (`n` is 0 or 1) returns an answer directly. Without it, the method would call itself forever and crash with a `StackOverflowError`.
- The **recursive case** must move towards the base case: `factorial(n - 1)` is one step smaller each time.
- `20!` is about 2.4 × 10¹⁸, which fits in a `long` but not in an `int`.
