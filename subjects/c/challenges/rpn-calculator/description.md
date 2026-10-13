# RPN Calculator

Old HP calculators, the PostScript language and the Java virtual machine all use **Reverse Polish Notation**: the operator comes after its operands, so `3 4 +` means 3 + 4, and no brackets are ever needed. It is evaluated with a **stack**: push numbers, and an operator pops two and pushes the result.

```
5 1 2 + 4 * + 3 -        5 + (1 + 2) × 4 − 3

push 5, 1, 2   → 5 1 2
+              → 5 3
push 4, *      → 5 12
+              → 17
push 3, -      → 14
```

Build the stack as a **linked list** of nodes from `malloc`, and evaluate each line:

```
3 4 +    →   7
1 +      →   Error: stack underflow
4 0 /    →   Error: division by zero
1 2 3    →   Error: leftover values
```

**Input**

Lines of tokens separated by spaces, until the end of the input: integers (maybe negative, such as `-5`) and the operators `+ - * /`. Every value stays between −10¹⁸ and 10¹⁸.

**Output**

For each line, the single value left on the stack, or `Error: stack underflow` (an operator with fewer than two values), `Error: division by zero`, `Error: leftover values` (more than one value at the end) or `Error: empty` (no tokens). After an error the rest of the line is ignored.

**Things to know**

- An operator pops `b` first, then `a`, and pushes `a op b`: `10 -3 /` is 10 / −3 = −3, rounding toward zero.
- `strtok(line, " \n")` splits a line into tokens; a token that is just `-` is an operator, `-5` is a number.
- Free every node: those you pop and those left at the end.
- Arrays of numbers are not allowed: the stack is made of nodes.
