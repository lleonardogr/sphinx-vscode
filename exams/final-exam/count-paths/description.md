# Count Paths

A robot starts at the **top-left** cell of a grid and wants to reach the **bottom-right** cell. It can only move **right** or **down**, and it can't step on blocked cells (`#`). How many different paths are there?

For

```
...
.#.
...
```

there are **2** paths: right-right-down-down and down-down-right-right.

Complete the recursive method `paths(row, col)`, which counts the paths from a cell to the end. The `main` method is ready.

**Input**

- Line 1: `rows cols` (1 to 18 each)
- Then `rows` lines of `cols` characters, `.` (free) or `#` (blocked)

**Output**

`Paths: N`. If the start or the end is blocked, `N` is `0`.

**Things to know**

- From a cell, every path goes either down or right first, so `paths(r, c) = paths(r + 1, c) + paths(r, c + 1)`.
- Base cases: outside the grid or on `#` there are no paths; the end cell has exactly one.
- An 18 × 18 grid has billions of paths, and plain recursion would visit each one. **Memoization** (`memo[r][c]`, starting at `-1`) computes each cell once.
