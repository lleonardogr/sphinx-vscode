# How Many Values?

Read a number of bits `n` and print how many different values `n` bits can hold, and the largest of them.

Each bit is 0 or 1, so 1 bit has 2 values. Every extra bit **doubles** the count: 2 bits have 4 values (`00`, `01`, `10`, `11`), 3 bits have 8, and 8 bits (one byte) have 256. Counting from 0, the largest value is one less: **255** for a byte.

**Input**

A whole number `n` (1 ≤ n ≤ 62).

**Output**

Two lines: `Values: ` followed by the number of values, and `Largest: ` followed by the largest value.

**Things to know**

- The number of values is 2 × 2 × … × 2, `n` times (2ⁿ). A loop that doubles a `long` computes it.
- Use `long`, not `int`: from 31 bits on, the count doesn't fit in an `int`.
- Compute it with a loop: `Math.pow` and the `<<` operator aren't allowed here.
