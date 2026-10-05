# Primes up to N

A **prime number** is a whole number greater than `1` that can only be divided evenly by `1` and itself. `7` is prime; `9` is not, because `9 = 3 × 3`.

Print every prime from `2` to `n` on one line, separated by spaces, and then how many there are.

For `n = 10`:

```
2 3 5 7
Count: 4
```

**Input**

A whole number `n` (1 ≤ n ≤ 10,000).

**Output**

- Line 1: the primes up to `n`, separated by spaces. If there are none, print `No primes`.
- Line 2: `Count: k`.

**Things to know**

- You need a **nested loop**: the outer loop walks through the candidates, the inner one looks for a divisor.
- A `boolean` flag such as `isPrime` remembers whether the inner loop found a divisor.
- You only need to try divisors up to the square root: if `k` has a divisor bigger than `√k`, it also has one smaller. Write the test as `d * d <= k`.
