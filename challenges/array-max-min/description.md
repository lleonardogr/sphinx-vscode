# Largest and Smallest

Read `n` numbers into an array and print the largest and the smallest.

**Input**

- Line 1: an integer `n`, the number of elements (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by spaces

**Output**

```
Max: <largest>
Min: <smallest>
```

**Things to know**

- `int[] numbers = new int[n];` makes room for `n` numbers, at indexes `0` to `n - 1`.
- Start both trackers at the **first element**, not at 0: if every number is negative, 0 would wrongly win.
- One loop can update both: `if (x > max) max = x;` and `if (x < min) min = x;`
