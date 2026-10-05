# Parse Numbers (NumberFormatException)

A sensor log mixes numbers with garbage. Add up the values that are whole numbers and report the ones you had to skip.

For `12 abc 30 4.5 -7`:

```
Skipped: abc
Skipped: 4.5
Valid numbers: 3
Sum: 35
```

**Input**

One line of values separated by single spaces.

**Output**

- `Skipped: value` for each value that isn't a valid `int`, in input order
- `Valid numbers: k`
- `Sum: s` (the sum can be larger than an `int`)

**Things to know**

- `Integer.parseInt(text)` throws a **`NumberFormatException`** when the text isn't a whole number that fits in an `int`: letters, decimals and numbers that are too big all fail. Signs and leading zeros (`+5`, `-0`, `007`) are fine.
- Keep the `try` small: only the code that can fail, so one bad value doesn't skip the others.
- Let `parseInt` decide what counts as a number instead of checking the characters yourself. Use a `long` for the sum.
