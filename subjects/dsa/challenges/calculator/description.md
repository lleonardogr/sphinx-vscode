# Calculator

Every calculator, spreadsheet and compiler has to respect **precedence**: in `2 + 3 * 4` the multiplication comes first. The classic way to do it, Dijkstra's *shunting-yard* algorithm, reads the expression once with **two stacks**: one for numbers and one for operators.

Evaluate each expression:

- whole numbers, `+`, `-`, `*`, `/` and parentheses, with any spaces;
- `*` and `/` before `+` and `-`; equal precedence goes left to right, so `8 - 3 - 2` is 3;
- `/` is integer division that drops the decimals, like Java's (`7 / 2` is 3);
- dividing by zero prints `error: division by zero`.

```
2 + 3 * 4       → 14
(2 + 3) * 4     → 20
8 - 3 - 2       → 3
7 / (5 - 5)     → error: division by zero
```

**Input**

- Line 1: `q` (1 ≤ q ≤ 100)
- Then `q` expressions, one per line (up to 1,000 characters). Numbers are between 0 and 1,000,000,000, there are no negative numbers in the input, and every expression is well formed. Every result along the way fits in a `long`.

**Output**

One line per expression: its value, or `error: division by zero`.

**Things to know**

- Applying an operator pops two numbers, the right operand first: for `8 - 3` the stack gives 3, then 8.
- Before pushing an operator, apply every operator on the stack with higher or equal precedence that isn't a `(`.
- `long` division by zero throws an `ArithmeticException`, which you can catch for that expression.
- A recursive parser (expression → term → factor) works too, if you prefer.
