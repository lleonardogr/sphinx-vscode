# Sieve of Eratosthenes

Testing every number for divisors gets slow fast: up to ten million it means billions of divisions. Over 2,000 years ago Eratosthenes found a better way, still used to make tables of primes: write all the numbers down, then **cross out** the multiples of each prime you meet. Whatever is left uncrossed is prime, and no division is needed. In C, the list of numbers is an array of flags.

Read `n` and print how many primes there are up to `n`, and the largest of them:

```
30   →   Primes: 10
         Largest: 29
```

(2, 3, 5, 7, 11, 13, 17, 19, 23 and 29.)

**Input**

One whole number `n` (2 ≤ n ≤ 10,000,000).

**Output**

`Primes: ` and the count, then `Largest: ` and the largest prime up to `n`.

**Things to know**

- An array of 10 million `char` flags takes 10 MB. Local variables live on the stack, which holds only a few MB, so declare it `static` or outside `main`; such arrays start filled with zeros.
- Crossing out the multiples of `i` can start at `i × i`. Compute it as `long long`: for `i` near 10 million, `i × i` doesn't fit in an `int`.
- Each test has 2 seconds. Testing divisors takes several seconds for 10 million; the sieve, well under one.
