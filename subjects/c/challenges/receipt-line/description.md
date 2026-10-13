# Receipt Line

A cash register prints every line of a receipt in fixed columns, so the prices line up however many digits they have. In C, `printf` does the lining up for you with **field widths**.

Read the items of a purchase and print the receipt:

```
  2 x    3.50 =     7.00
  1 x   12.99 =    12.99
 10 x    0.25 =     2.50
------------------------
TOTAL              22.49
```

Each item line has the quantity in 3 characters, ` x `, the unit price in 7 characters with 2 decimals, ` = `, and the line total in 8 characters with 2 decimals. Then come 24 dashes, and `TOTAL` with the total right-aligned to the end of the 24 columns.

**Input**

- Line 1: `n`, the number of items (0 ≤ n ≤ 20)
- Then `n` lines with a quantity (1 to 99) and a unit price (0.01 to 999.99, always with 2 decimals)

**Output**

The `n` item lines, the dashes and the `TOTAL` line, as above.

**Things to know**

- `%3d` prints an `int` in at least 3 characters, padded with spaces on the left. `%7.2f` prints a `double` in at least 7 characters, with 2 decimals.
- Read a `double` with `%lf` in `scanf`, but print it with `%f` in `printf`.
- With no items, the receipt still has the dashes and `TOTAL` with `0.00`.
