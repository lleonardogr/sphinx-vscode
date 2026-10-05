# Robust Calculator

A calculator reads lines like `7 + 5`. Users type all kinds of things, so it must **never crash**: every problem becomes an error message, and the next line is still read.

| Problem | Print |
|---------|-------|
| the line doesn't have exactly 3 parts | `Error: expected number operator number` |
| a number isn't a valid `int` | `Error: not a number` |
| the operator isn't `+ - * / %` | `Error: unknown operator ^` |
| `/` or `%` by zero | `Error: division by zero` |
| the result doesn't fit in an `int` | `Error: overflow` |

Otherwise print `7 + 5 = 12` (integer division and remainder for `/` and `%`). Check the problems **in the order of the table**: `abc ^ 0` is `not a number`.

**Input**

- Line 1: `t`, the number of lines
- Then `t` lines; the parts are separated by one or more spaces

**Output**

One line per input line.

**Things to know**

- `CalculatorException` is given. Throw it from `calculate` for the calculator's own problems, and catch it in `main`.
- `Math.addExact(a, b)` (and `subtractExact`, `multiplyExact`) throw an `ArithmeticException` instead of silently wrapping around on overflow, the same exception as dividing by zero.
- Catching an exception and **throwing a different one** with a clearer message is common: it hides details the caller doesn't need.
