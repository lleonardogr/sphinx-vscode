# Org Chart

A company's org chart is a **tree**: the CEO at the root, and every other employee has exactly one manager. HR wants three numbers from it: how many levels it has, which level has the most people, and how many employees have no one reporting to them.

Employees are numbered 1 to `n`; employee 1 is the CEO, and every manager has a **smaller** number than the people who report to them.

For 10 employees whose managers (for employees 2 to 10) are `1 1 2 2 3 4 4 5 5`, the levels are {1}, {2, 3}, {4, 5, 6} and {7, 8, 9, 10}:

```
levels: 4
widest level: 4
widest level size: 4
no reports: 5
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: the managers of employees 2 to `n`, in order (empty when `n` is 1)

**Output**

- `levels: ` and the number of levels (the CEO is level 1).
- `widest level: ` and the level with the most people (the lowest one on a tie), and `widest level size: ` and how many.
- `no reports: ` and how many employees manage no one.

**Things to know**

- The tree can be a single chain 200,000 levels deep. Walking up to the CEO from every employee is then O(n²).
- Because managers come first, one pass computes every level from the manager's level.
- An `int[]` indexed by employee number works as the tree: `manager[i]`, `level[i]`.
