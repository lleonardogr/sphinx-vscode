# How Many Bits?

Each bit is 0 or 1, so 1 bit has 2 values, and every extra bit **doubles** them: 8 bits (a byte) hold **256** values, from 0 to 255. Turned around, a number needs as many bits as the times you can **halve** it before it reaches 0: 300 → 150 → 75 → 37 → 18 → 9 → 4 → 2 → 1 → 0 is 9 halvings, so 300 needs **9 bits**, which is **2 bytes**.

Answer both questions.

**Input**

One line, either `bits n` (1 ≤ n ≤ 62) or `number x` (0 ≤ x ≤ 10¹⁸).

**Output**

For `bits n`: `Values: ` and how many values n bits hold, then `Largest: ` and the largest of them (counting from 0).

For `number x`: `Bits: ` and how many bits x needs (0 needs 1), then `Bytes: ` and how many whole bytes those bits take.

**Things to know**

- Use `long`: 62 bits hold more than 4 quintillion values.
- `(bits + 7) / 8` divides by 8 and rounds up.
- Double and halve in loops: `Math.pow`, `Math.log`, `<<` and the bit-counting methods aren't allowed here.
