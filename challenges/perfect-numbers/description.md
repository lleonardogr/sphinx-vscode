# Perfect Numbers

The **proper divisors** of a number are all its divisors except the number itself. The proper divisors of `12` are `1, 2, 3, 4, 6`, which add up to `16`. Compare that sum with the number:

| Sum of proper divisors | The number is |
|------------------------|---------------|
| equal to the number (`6 = 1 + 2 + 3`) | `perfect` |
| bigger than the number (`12 < 16`) | `abundant` |
| smaller than the number (`8 > 1 + 2 + 4`) | `deficient` |

Write two methods, and let `classify` call `sumOfDivisors`:

```java
long sumOfDivisors(long n)
String classify(long n)
```

**Input**

- Line 1: `t`, the number of values
- Then `t` lines with a number `n` (1 ≤ n ≤ 10¹²)

**Output**

`12 is abundant` for each value.

**Things to know**

- Numbers go up to a trillion, so trying every divisor up to `n` is far too slow. Divisors come in **pairs** (`d` and `n / d`), so you only need to try `d` while `d * d <= n`.
- When `d * d == n` the pair is the same number: add it once. `1` has no proper divisors, so its sum is `0`.
- Small **helper methods** like these make a hard problem easier: each one does one job and can be tested on its own.
