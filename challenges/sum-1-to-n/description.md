# Sum from 1 to N

Add up all the whole numbers from 1 to `n`. For example, for `n = 5` the answer is `1 + 2 + 3 + 4 + 5 = 15`. Use a loop that keeps a running total.

**Input**

An integer `n` (1 ≤ n ≤ 10000).

**Output**

The sum.

**Things to know**

- Keep a running total in a variable declared **before** the loop: `int sum = 0;`
- Inside the loop, `sum += i;` adds the current number.
- Print the total **after** the loop, once. For n = 10000 the sum is 50 005 000, which still fits in an `int`.
