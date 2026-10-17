# Peak Load

A server records its load every second. Maintenance needs `k` consecutive seconds, and it is safest when the **peak** load during that window is as low as possible. Find the window whose highest load is the smallest.

For `n = 8`, `k = 3` and the loads `40 75 31 22 28 90 60 35`, the windows' peaks are 75, 75, 31, 90, 90 and 90. The best window starts at second 3:

```
best start: 3
best peak: 31
```

**Input**

- Line 1: `n` and `k` (1 ≤ k ≤ n ≤ 200,000)
- Line 2: `n` loads (0 to 1,000,000), one per second

**Output**

`best start: ` and the second where the best window starts, counting from 1 (the earliest one on a tie), then `best peak: ` and its peak.

**Things to know**

- Recomputing each window's maximum is O(n·k): with 200,000 seconds and windows of 100,000, that is 10¹⁰ steps.
- A **monotonic deque** of indexes keeps each window's maximum at its front, with every index added once and removed at most once: O(n).
- `ArrayDeque` works at both ends: `peekFirst`, `pollFirst`, `peekLast`, `pollLast` and `offerLast`.
