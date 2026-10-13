# Command-Line Calculator

A command-line calculator reads expressions until the input ends, and must not fall over when someone types nonsense. In C, the trap is `scanf`: when it can't read a number it stops, leaves the bad characters in the input, and tells you only through its **return value**. Programs that ignore it loop forever or use garbage.

Read expressions `a op b`, one per line, until the end of the input. For each line print the result, or an error, and finish with a count.

```
5 + x        Error: not a number
8 / 0        Error: division by zero
2 ^ 3        Error: unknown operator
1 - 9        = -8
             Lines: 4, errors: 3
```

**Input**

Lines with an integer, an operator character and another integer, separated by spaces. The integers are between −10⁹ and 10⁹. A line may be broken: a word where a number should be.

**Output**

For each line, one of:

- `= ` and the result, for `+`, `-`, `*`, `/` (integer division) and `%`;
- `Error: not a number`, when a number can't be read (skip the rest of that line);
- `Error: division by zero`, for `/` or `%` by 0;
- `Error: unknown operator`, for any other operator.

Then `Lines: N, errors: E`.

**Things to know**

- `scanf("%lld %c %lld", &a, &op, &b)` returns 3 when it read all three, fewer when it stopped early, and `EOF` when the input ended before anything was read.
- After a failure, read and discard characters with `getchar()` until `'\n'` or `EOF`, so the next line starts clean.
- `/` and `%` round toward zero as in Java: `-7 / 2` is `-3` and `-7 % 2` is `-1`.
- `long long` holds the product of two numbers up to 10⁹.
