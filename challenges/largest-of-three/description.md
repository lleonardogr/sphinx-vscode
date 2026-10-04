# Largest of Three

Read three whole numbers and print the **largest** one. Two or even all three numbers can be equal; then print that value once. Solve it with comparisons and `if`: `Math.max` isn't allowed here.

**Input**

One line with three integers `a b c`.

**Output**

The largest of the three numbers.

**Things to know**

- The comparison operators are `>`, `>=`, `<`, `<=`, `==` and `!=`. Each one gives a `boolean`.
- `&&` means "and": `a >= b && a >= c` is true only when both comparisons are.
- The starter already splits the line into three numbers with `split(" ")` and `Integer.parseInt`.
