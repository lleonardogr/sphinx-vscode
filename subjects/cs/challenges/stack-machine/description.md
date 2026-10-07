# Stack Machine

When you run a Java program, the JVM doesn't use named registers: it computes on a **stack**. The bytecode for `(3 + 4) * 2` is roughly *push 3, push 4, add, push 2, multiply*: each operation takes its values from the top of the stack and puts the result back.

Write a small stack machine. The stack starts empty, and the instructions are:

| Instruction | What it does |
|-------------|--------------|
| `PUSH n` | put the number n on top |
| `ADD`, `SUB`, `MUL` | take the top value b, then the next value a, and push a + b, a − b or a × b |
| `DUP` | push a copy of the top value |
| `PRINT` | take the top value and print it |

So `PUSH 10`, `PUSH 3`, `SUB` leaves **7**: the right-hand value is on top.

**Input**

The number of instructions `n` (1 ≤ n ≤ 50), then one instruction per line. Numbers are whole, from −1,000,000 to 1,000,000.

**Output**

What `PRINT` prints, one number per line. After the last instruction, `Stack: ` followed by the values left, from bottom to top and separated by spaces, or `Stack: empty`.

If an instruction needs more values than the stack has, print `Error at line K: stack underflow` and stop. For an instruction that isn't in the table, print `Error at line K: unknown instruction` and stop (lines count from 1).

**Things to know**

- An array and a counter make a stack: `stack[top++] = value` pushes, `stack[--top]` pops.
- Use `long`: multiplying can go far beyond what fits in an `int`.
- Pop **b** first, then **a**: the order matters for `SUB`.
