# Search Steps

Read a **sorted** list of numbers and a target, and count how many numbers each search has to look at to find it.

- **Linear search** looks at the numbers from the first to the last, until it finds the target.
- **Binary search** looks at the number in the **middle** of the range it is searching (`mid = (lo + hi) / 2`, starting with the whole list). If it isn't the target, it keeps only the half where the target can be, and repeats.

In `1 3 5 7 9 11 13 15 17 19`, linear search finds 7 at the 4th step. Binary search looks at 9 (index 4), then 3 (index 1), then 5, then 7: 4 steps. For 19, linear search needs 10 steps but binary search only 4.

**Input**

Three lines: the count `n` (1 ≤ n ≤ 100), the `n` numbers in increasing order, and the target.

**Output**

Three lines: `Linear: ` and its steps, `Binary: ` and its steps, and `Found: yes` or `Found: no`. When the target isn't in the list, each search counts every number it looked at before giving up.

**Things to know**

- Binary search only works on a **sorted** list, but it halves the range at every step: 1,000,000 numbers need at most 20 steps.
- Keep `lo` and `hi`: if the middle number is too small, set `lo = mid + 1`; if too big, `hi = mid - 1`.
- Write both searches yourself: `Arrays.binarySearch` isn't allowed here.
