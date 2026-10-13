# Fractions

`0.1 + 0.2` is not exactly `0.3` in a `double`, but `1/10 + 2/10` is exactly `3/10` as a fraction. Spreadsheets, music software and computer algebra systems keep exact fractions as a **pair of integers**, which in C is a natural `struct`.

Read operations on fractions and print each result in lowest terms:

```
1/2 + 1/3    →   5/6
3/4 * 2/3    →   1/2
5/6 - 1/6    →   2/3
1/2 / 0/5    →   Error: division by zero
```

**Input**

Lines `a/b op c/d` until the end of the input, where `op` is `+`, `-`, `*` or `/`. Numerators and denominators are integers from −1000 to 1000; denominators are never 0.

**Output**

For each line, the result in lowest terms, with the sign on the numerator: `p/q`, or just `p` when the denominator is 1. Dividing by a fraction equal to 0 prints `Error: division by zero`.

**Things to know**

- `typedef struct { long num, den; } Fraction;` makes `Fraction` a type: functions can take and return it, like any value.
- Lowest terms: divide both by their greatest common divisor, and keep the denominator positive.
- `scanf("%ld/%ld %c %ld/%ld", …)` reads a whole line; the `/` in the format must match the input.
