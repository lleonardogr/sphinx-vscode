# Multiplication Table

Read a number `n` and print its multiplication table from 1 to 10.

**Input**

An integer `n`.

**Output**

Ten lines in this format (example for `3`):

```
3 x 1 = 3
3 x 2 = 6
...
3 x 10 = 30
```

**Things to know**

- A loop from `1` to `10` gives each multiplier.
- Build the line by joining values with `+`: `n + " x " + i + " = " + (n * i)`. The parentheses make Java multiply before joining the text.
- Or format it: `"%d x %d = %d".formatted(n, i, n * i)`.
