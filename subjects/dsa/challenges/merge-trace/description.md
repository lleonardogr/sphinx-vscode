# Merge Trace

Databases sort data too big for memory by sorting chunks and **merging** them, and Java sorts lists of objects with a merge sort too. The heart of it is the merge: two sorted runs become one by repeatedly taking the smaller front value.

Run a **bottom-up merge sort** and show each pass:

1. Start with runs of width 1 (every value alone is sorted).
2. Merge neighbouring runs: positions `[0, w)` with `[w, 2w)`, then `[2w, 3w)` with `[3w, 4w)`, and so on. A run with no partner at the end stays as it is.
3. Double the width and repeat while it is smaller than `n`.

When merging, take the left value on a tie, and count one **comparison** each time you compare two front values.

For `5 2 8 1 9 3 7 4`:

```
width 1: 2 5 1 8 3 9 4 7
width 2: 1 2 5 8 3 4 7 9
width 4: 1 2 3 4 5 7 8 9
comparisons: 17
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 64)
- Line 2: `n` integers between −1,000 and 1,000

**Output**

For each pass, `width ` and the width, `: ` and the array after the pass, separated by spaces. Then `comparisons: ` and the total. (With `n = 1` there are no passes: print just the comparisons.)

**Things to know**

- In a pass of width `w`, a merge goes from `lo` to `mid = min(lo + w, n)` and `hi = min(lo + 2w, n)`.
- When one run runs out, copy the rest of the other without comparing.
- No library sorting: merging is the exercise.
