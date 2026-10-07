# Truth Table

A **logic gate** takes bits in and gives one bit out. Its **truth table** lists the output for every combination of inputs:

| Gate | Output is 1 when… |
|------|-------------------|
| `AND` | both inputs are 1 |
| `OR` | at least one input is 1 |
| `XOR` | exactly one input is 1 |
| `NAND` | not both are 1 (the opposite of AND) |
| `NOR` | neither is 1 (the opposite of OR) |

Read the name of a gate and print its truth table.

**Input**

One line with the gate's name, in upper case.

**Output**

A header line `A B OUT`, then the four rows `A B OUT` for A and B = `0 0`, `0 1`, `1 0` and `1 1`, in that order. For a name that isn't in the table (including lower case), print `Unknown gate: ` followed by it.

**Things to know**

- Nested loops `for (int a = 0; a <= 1; a++)` and `for (int b = 0; b <= 1; b++)` give the rows in order.
- Java's `&&`, `||`, `^` and `!` are AND, OR, XOR and NOT for booleans.
- `cond ? 1 : 0` turns a boolean back into a bit.
