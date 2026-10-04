# Sum of Digits

Read a non-negative number and print the sum of its digits. For example, for `1234` the answer is `1 + 2 + 3 + 4 = 10`.

Use **math** to solve it, not Strings:

- `n % 10` gives the last digit (`1234 % 10` is `4`);
- `n / 10` removes the last digit (`1234 / 10` is `123`).

**Input**

An integer `n` (0 ≤ n ≤ 2,000,000,000).

**Output**

The sum of the digits of `n`.

**Things to know**

- A `while (n > 0)` loop repeats until no digits are left.
- `sum += n % 10;` then `n /= 10;` handles one digit per turn.
- For `0`, the loop never runs and the sum stays `0`.
