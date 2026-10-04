# Prime Numbers (Method)

Complete the method `isPrime(int n)` so that it returns `true` when `n` is a prime number and `false` otherwise.

A **prime number** is greater than 1 and divisible only by 1 and itself (2, 3, 5, 7, 11, …).

The `main` method is already written: it reads several numbers and calls your method for each one. **Only change `isPrime`.**

**Input**

- Line 1: how many numbers follow, `t`
- Line 2: `t` integers

**Output**

For each number, `<n> is prime` or `<n> is not prime`.

**Things to know**

- A method gives back its result with `return`. As soon as `return false;` runs, the method stops.
- You only need to test divisors up to the square root: if `n` has a divisor bigger than √n, it also has one smaller. Loop while `i * i <= n`.
- Numbers below 2, including 0, 1 and negative numbers, are not prime.
