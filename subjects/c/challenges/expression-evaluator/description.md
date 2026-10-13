# Expression Evaluator

Calculators, spreadsheets and compilers all read text like `2 + 3 * 4` and work out 14, not 20. The classic way is a **recursive descent parser**: one function per level of precedence, and functions that **call each other**, which in C means declaring them with prototypes first.

```
expr   = term   { (+ or -) term }        adds and subtracts, left to right
term   = factor { (* or /) factor }      multiplies and divides, left to right
factor = number | - factor | ( expr )    a number, a minus sign, or brackets
```

Read expressions, one per line, until the end of the input, and print the value of each:

```
-(7 - 10) / 2    1
8 / (3 - 3)      Error: division by zero
2 +              Error: syntax
```

**Input**

Lines with whole numbers, `+ - * /`, brackets and spaces. Every value along the way stays between −10¹⁸ and 10¹⁸.

**Output**

For each line, its value, or:

- `Error: syntax` when the line is not a valid expression (a missing number or bracket, two numbers in a row, any other character);
- `Error: division by zero`.

When a line has both problems, report the first one found reading left to right.

**Things to know**

- Read the input one character at a time with `getchar()`, keeping the next character in a variable, so a function can look at it before deciding what to do.
- `/` is integer division, rounding toward zero, as in C itself: `-7 / 2` is `-3`. A minus sign can stand before any factor: `--5` is 5.
- When something goes wrong, remember the error in a flag, keep reading to the end of the line, and print the message there.
