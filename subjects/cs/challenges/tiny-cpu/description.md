# Tiny CPU

A processor repeats one cycle billions of times per second: **fetch** the next instruction, **decode** what it asks for, **execute** it. Write a simulator for a tiny processor with one register, the **accumulator** (ACC), and 16 memory cells, `memory[0]` to `memory[15]`. Everything starts at 0.

| Instruction | What it does |
|-------------|--------------|
| `SET n` | ACC = n |
| `LOAD a` | ACC = memory[a] |
| `STORE a` | memory[a] = ACC |
| `ADD a` | ACC = ACC + memory[a] |
| `SUB a` | ACC = ACC − memory[a] |
| `JUMP k` | continue at line k |
| `JZ k` | if ACC is 0, continue at line k |
| `OUT` | print ACC |
| `HALT` | stop |

The program counter starts at line **1**. After each instruction it moves to the next line, unless a `JUMP` or a `JZ` (when ACC is 0) sends it elsewhere.

This program counts down from 3: line 1–4 put 3 in memory[0] and 1 in memory[1]; lines 5–10 print, subtract 1 and loop until the value reaches 0.

```
SET 3
STORE 0
SET 1
STORE 1
LOAD 0
OUT
SUB 1
STORE 0
JZ 11
JUMP 5
HALT
```

**Input**

The number of lines `n` (1 ≤ n ≤ 50), then the `n` lines of the program. Numbers `a` are from 0 to 15, `k` from 1 to n.

**Output**

What the program prints with `OUT`, one number per line. Then one final line:

- `Halted after N steps` when it runs `HALT` or moves past the last line (N counts every instruction run, `HALT` included);
- `Step limit reached` if it is still running after 1000 steps;
- `Error at line K: <line>` at an instruction that isn't in the table (it isn't counted).

**Things to know**

- Keep the program in an array and use the program counter `pc` as the index: line `pc` is `program[pc - 1]`.
- `line.split(" ")` separates the name from its number.
- The step limit protects you from programs that loop forever, like `JUMP 1`.
