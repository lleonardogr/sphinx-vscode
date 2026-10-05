# Safe Division (try / catch)

When something goes wrong while a program runs, Java **throws an exception**. If nothing catches it, the program stops with an error. A `try` / `catch` lets you handle the problem and keep going.

Divide pairs of whole numbers. Dividing by zero must not crash the program:

```
10 / 2 = 5
Cannot divide by zero
-9 / 4 = -2
```

**Input**

- Line 1: `t`, the number of pairs
- Then `t` lines with two integers `a b`

**Output**

`a / b = result` (integer division), or `Cannot divide by zero`.

**Things to know**

- Code that might fail goes in `try { … }`. If it throws, the rest of the `try` is skipped and the matching `catch (ExceptionType e) { … }` runs.
- Integer division by zero throws an **`ArithmeticException`**.
- Use the exception instead of checking `b == 0` yourself: that is the point of this challenge.
