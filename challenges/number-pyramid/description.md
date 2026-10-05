# Number Pyramid

Print a pyramid of numbers with `n` rows. Row `r` counts up from `1` to `r` and then back down to `1`, with one space between numbers.

For `n = 4`:

```
1
1 2 1
1 2 3 2 1
1 2 3 4 3 2 1
```

**Input**

A whole number `n` (1 ≤ n ≤ 9).

**Output**

`n` lines, as above. No line starts or ends with a space.

**Things to know**

- A loop inside another loop is called a **nested loop**: the outer loop picks the row, the inner loops print that row.
- An inner loop can depend on the outer one: `for (int i = 1; i <= row; i++)`.
- Loops can also count down: `for (int i = row - 1; i >= 1; i--)`.
