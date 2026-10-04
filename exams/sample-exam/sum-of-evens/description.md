# Sum of Evens

Read a list of numbers and print the sum of the **even** ones (0 if there are none).

**Input**

- Line 1: the number of values `n` (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by single spaces

**Output**

The sum of the even numbers.

**Things to know**

- `n % 2 == 0` tests for even, and it works for negative numbers too.
- Keep a running total that starts at `0`. If no number is even, `0` is the right answer.
