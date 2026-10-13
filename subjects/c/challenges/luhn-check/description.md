# Luhn Check

Type one digit of a credit card number wrong and the website complains before it even asks the bank. That's the **Luhn algorithm**, a check digit that also protects IMEI numbers and many ID numbers. It catches every single-digit mistake and most swaps of neighbouring digits.

Starting from the **rightmost** digit (the check digit), double every **second** digit. When a doubled digit is more than 9, subtract 9. Add all the digits: the number is valid when the total ends in 0.

For `79927398713`:

```
digits      7  9  9  2  7  3  9  8  7  1  3
doubled?       *     *     *     *     *
becomes     7 18  9  4  7  6  9 16  7  2  3
minus 9     7  9  9  4  7  6  9  7  7  2  3   →  total 70: valid
```

**Input**

- Line 1: `t`, the number of numbers (1 ≤ t ≤ 100)
- Then `t` lines with a whole number (0 to 10¹⁹ − 1, written without leading zeros)

**Output**

For each number: the number, a space, and `valid` or `invalid`.

**Things to know**

- Split the work into functions: one that computes the Luhn sum, one that says whether a number is valid. `main` only reads and prints.
- Numbers go up to 19 digits, which fits in an `unsigned long long` (up to about 1.8 × 10¹⁹): read and print it with `%llu`.
- `n % 10` is the last digit and `n / 10` removes it.
