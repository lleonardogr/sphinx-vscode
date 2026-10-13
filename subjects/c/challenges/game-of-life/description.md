# Game of Life

In 1970 the mathematician John Conway invented a "game" with no players: a grid of cells, each alive or dead, that changes by itself one generation at a time. Four rules are enough for gliders that crawl across the grid, blinkers and patterns that grow forever, which is why the Game of Life is famous far beyond mathematics.

For each cell, count its live **neighbours**, the 8 cells around it:

- a live cell with 2 or 3 live neighbours stays alive; otherwise it dies;
- a dead cell with exactly 3 live neighbours comes alive.

Every cell changes **at the same time**, from the same old generation. Cells outside the grid count as dead.

Read a grid and print it after `g` generations. A row of three blinks:

```
...         .#.
###   →1→   .#.
...         .#.
```

**Input**

- Line 1: the rows and columns (1 to 50 each) and `g`, the number of generations (0 ≤ g ≤ 100)
- Then the grid, one row per line: `#` for alive, `.` for dead

**Output**

The grid after `g` generations, in the same form.

**Things to know**

- `char grid[50][50]` holds the grid: `grid[r][c]` is row `r`, column `c`.
- `scanf(" %c", &grid[r][c])` reads the next cell, skipping newlines.
- Because all cells change together, you can't update the grid while you are still reading it: build the next generation separately.
