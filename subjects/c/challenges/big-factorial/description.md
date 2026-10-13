# Big Factorial

25! is 15,511,210,043,330,985,984,000,000: 26 digits, too many for even an `unsigned long long`, which tops out at 20. Java has `BigInteger`; C has nothing built in, so libraries for big numbers (used in cryptography, for example) store a number as an **array of digits** and do arithmetic on it the way you learnt at school.

Read `n` and print `n!` exactly, followed by how many digits it has:

```
25   →   15511210043330985984000000
         Digits: 26
```

**Input**

One whole number `n` (0 ≤ n ≤ 1000).

**Output**

`n!` in full, then `Digits: ` and its number of digits. (`0!` is 1.)

**Things to know**

- 1000! has 2,568 digits, so an array of 3,000 digits is enough.
- Store the last digit first: digit `i` is worth 10ⁱ, and new digits are added at the end of the array as the number grows.
- Multiplying a long number by a small one: go from the last digit to the first, computing `digit × factor + carry`; the new digit is that `% 10` and the carry is that `/ 10`.
- No `double` or `float`: they would round the number.
