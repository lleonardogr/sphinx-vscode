# Bracket Checker

Code editors underline a bracket that is never closed, or closed by the wrong one. Check each line of input and report the first problem with `(`, `)`, `[`, `]`, `{` and `}`:

```
if (a[i] == b) { return; }   →   OK
int x = (1 + 2];             →   Error at column 15: expected ')' but found ']'
f(g(h())                     →   Error at end: '(' from column 2 is not closed
}                            →   Error at column 1: unexpected '}'
```

**Input**

Lines of text, at most 200 characters each, until the end of the input. Every character other than the six brackets is ignored, even inside quotes.

**Output**

For each line, one of:

- `OK`;
- `Error at column C: unexpected 'X'`, for a closing bracket when nothing is open;
- `Error at column C: expected 'X' but found 'Y'`, for a closing bracket that doesn't match the last open one;
- `Error at end: 'X' from column C is not closed`, when the line ends with brackets still open (report the last one opened).

Columns count from 1. Report only the first error of each line.

**Things to know**

- An array with an index works as a **stack**: push an opening bracket, and compare a closing one with the top.
- Keep each opening bracket's column with it.
