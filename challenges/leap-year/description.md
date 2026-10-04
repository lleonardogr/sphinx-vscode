# Leap Year

A year is a **leap year** if:

- it is divisible by 4, **and**
- it is **not** divisible by 100, **unless** it is also divisible by 400.

So 2024 and 2000 are leap years, but 1900 and 2023 are not.

**Input**

A year (a positive integer).

**Output**

`Leap year` or `Not a leap year`.

**Things to know**

- `%` checks divisibility: `year % 4 == 0` means "divisible by 4".
- `&&` (and), `||` (or) and `!=` (not equal) combine conditions. Use parentheses to make the order clear: `a && (b || c)`.
- A `boolean` variable can store the whole rule: `boolean leap = …;`
