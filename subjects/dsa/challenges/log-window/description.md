# Log Window

A web server writes one log line per request, in time order. Dashboards keep asking questions like "how many requests arrived between second 1,200 and second 1,500?", thousands of times, so scanning the whole log for every question is too slow.

Read the sorted timestamps and `q` windows `a b`. For each window, count the requests with `a ≤ t ≤ b`. Then print the **total** of all the counts and the count of the **busiest** window.

For the timestamps `2 4 4 4 7 9` and the windows `4 4` (3 requests), `3 8` (4 requests: 4, 4, 4 and 7) and `10 20` (none):

```
total: 7
busiest: 4
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: `n` timestamps in non-decreasing order (0 ≤ t ≤ 1,000,000,000); the same second can repeat
- Line 3: `q` (1 ≤ q ≤ 200,000)
- Then `q` lines with `a` and `b` (0 ≤ a ≤ b ≤ 1,000,000,000)

**Output**

`total: ` and the sum of the counts, then `busiest: ` and the largest count.

**Things to know**

- A loop over all `n` timestamps for each of the `q` windows is 4 × 10¹⁰ steps on the biggest test. Binary search answers a window in about 2 × 18 steps.
- Find two boundaries: the first index with `t ≥ a` and the first index with `t > b`. The count is their difference.
- The total can reach 4 × 10¹⁰, past `int`'s limit of about 2.1 × 10⁹: use a `long`.
- Write the search yourself: `Arrays.binarySearch` finds *some* equal value, not the first one.
