# Matrix Sums

A **matrix** is a grid of numbers with rows and columns. Read one and print the sum of each row, the sum of each column, and the total.

For

```
1 2 3
4 5 6
```

the output is

```
Row sums: 6 15
Column sums: 5 7 9
Total: 21
```

**Input**

- Line 1: `rows cols` (1 to 20 each)
- Then `rows` lines with `cols` integers

**Output**

The three lines above, with the sums separated by single spaces.

**Things to know**

- A 2D array is an array of arrays: `int[][] grid = new int[rows][cols];` and `grid[r][c]` is row `r`, column `c`.
- **Nested loops** walk the grid: the outer loop picks a row (or a column), the inner loop goes along it.
- `grid.length` is the number of rows, and `grid[0].length` the number of columns.
