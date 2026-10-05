# Second Largest

Find the **second largest different value** in an array. In `4 9 2 9 7` the largest is `9` and the second largest is `7` (the second `9` doesn't count, because it is the same value).

**Input**

- Line 1: `n` (1 ≤ n ≤ 1000)
- Line 2: `n` integers

**Output**

`Second largest: 7`, or `No second largest` when every value is the same.

**Things to know**

- You can solve it in **one pass** with two trackers: `largest` and `second`. When a new largest appears, the old largest slides down to `second`.
- `Integer.MIN_VALUE` is the smallest `int`. It can also appear in the input, so use a `boolean` to remember whether `second` was really found.
- Solve it with loops, without sorting the array.
