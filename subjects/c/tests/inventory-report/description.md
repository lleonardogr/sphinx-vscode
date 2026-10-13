# Inventory Report

**Test: units 1 to 4.** This program mixes what you have practised so far: reading and splitting lines, arrays, sorting, functions and aligned output.

A small shop exports its stock as lines of `code,name,quantity,price`. Write the report the manager reads every morning: the items from the most valuable stock (quantity × price) to the least, a total, and the items that are running out.

For this input:

```
4
P100,Blue pen,40,1.50
N200,Notebook A5 squared,12,6.90
S300,Stapler,3,15.00
E400,Eraser,4,0.80
```

the report is:

```
CODE     NAME                   QTY      VALUE
N200     Notebook A5 squared     12      82.80
P100     Blue pen                40      60.00
S300     Stapler                  3      45.00
E400     Eraser                   4       3.20
Total value: 191.00
Low stock: S300, E400
```

**Input**

- Line 1: `n`, the number of items (1 ≤ n ≤ 50)
- Then `n` lines `code,name,quantity,price`: the code has 1 to 8 letters and digits, the name 1 to 30 characters (spaces allowed, no commas), the quantity is 0 to 1000 and the price 0.01 to 999.99, always with 2 decimals.

**Output**

- The header, then one line per item printed with `"%-8s %-20.20s %5d %10.2f"`: code, name (cut to 20 characters), quantity, value. Items go from the highest value down; equal values go by code, in `strcmp` order.
- `Total value: ` and the sum of the values, with 2 decimals.
- `Low stock: ` and the codes of the items with fewer than 5 units, in input order, separated by `, `, or `none`.

**Things to know**

- `sscanf(line, "%8[^,],%30[^,],%d,%lf", code, name, &qty, &price)` splits a line: `%[^,]` reads everything up to a comma, and the number limits it to the array's size.
- Sort an array of positions instead of the data itself: the input order stays available for the low-stock list.
- `qsort` is not allowed here: it needs a pointer to a function, which comes in the Pointers unit.
