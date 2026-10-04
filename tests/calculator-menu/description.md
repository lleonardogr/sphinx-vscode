# Calculator Menu

Build a small **menu-driven calculator**, the kind of console app that keeps running until the user chooses to exit. This test combines **variables**, **conditionals** and **loops** in one program.

**What your program does**

1. Print the menu **once**, at the start:

   ```
   === Calculator ===
   1. Add
   2. Subtract
   3. Multiply
   4. Divide
   0. Exit
   ```

2. Then read options, one per line, until the option is `0`:

| Option | Reads | Prints |
|--------|-------|--------|
| `1` | a line with two integers `a b` | `a + b = result` |
| `2` | a line with two integers `a b` | `a - b = result` |
| `3` | a line with two integers `a b` | `a * b = result` |
| `4` | a line with two integers `a b` | `a / b = result` (integer division), or `Cannot divide by zero` when `b` is `0` |
| `0` | nothing | `Operations: n` (the number of calculations that printed a result), then `Goodbye!` and the program ends |
| anything else | nothing | `Invalid option` |

**Example**

Input:

```
1
8 2
4
7 0
9
0
```

Output:

```
=== Calculator ===
1. Add
2. Subtract
3. Multiply
4. Divide
0. Exit
8 + 2 = 10
Cannot divide by zero
Invalid option
Operations: 1
Goodbye!
```

**Things to know**

- A `while (true)` loop with `break`, or a `do … while (option != 0)` loop, keeps the menu running.
- A `switch` on the option keeps the choices readable.
- `line.trim().split("\\s+")` splits `"8 2"` into `["8", "2"]`. Turn each part into a number with `Integer.parseInt`.
- Count the operations in a variable declared **before** the loop.
