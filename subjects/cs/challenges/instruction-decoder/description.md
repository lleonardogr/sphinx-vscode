# Instruction Decoder

A processor runs **machine code**: instructions stored as bits. Imagine a tiny processor whose instructions are 8 bits long. The first 4 bits are the **opcode** (which instruction) and the last 4 bits are the **operand** (a number from 0 to 15 that the instruction uses).

| Opcode | Instruction | Operand |
|--------|-------------|---------|
| `0000` | `HALT` | none |
| `0001` | `LOAD` | a number |
| `0010` | `ADD` | a number |
| `0011` | `SUB` | a number |
| `0100` | `STORE` | a number |
| `0101` | `JUMP` | a number |
| `0110` | `JZ` | a number |
| `0111` | `OUT` | none |

So `00010101` is opcode `0001` = `LOAD` with operand `0101` = 5: **LOAD 5**. Opcodes from `1000` to `1111` aren't used.

Read some instructions and decode them.

**Input**

The number of instructions `n` (1 ≤ n ≤ 20), then one instruction per line.

**Output**

For each instruction, one line:

- the instruction's name, followed by a space and the operand in decimal when it has one, like `LOAD 5` or `HALT`;
- `Unknown opcode ` followed by the 4 opcode bits, for an opcode that isn't in the table;
- `Invalid instruction` if the line isn't exactly 8 characters, each `0` or `1`.

**Things to know**

- The **fetch–decode–execute** cycle starts with exactly this: the processor reads the bits and works out what they ask for.
- `instruction.substring(0, 4)` is the opcode and `instruction.substring(4)` the operand.
- An array `String[] names = {"HALT", "LOAD", …}` lets you find a name by its opcode number.
