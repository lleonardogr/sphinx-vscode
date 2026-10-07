# CPU Time

A processor works to the beat of a **clock**. Each tick is a **cycle**, and a 3 GHz processor ticks 3 billion times per second. Each instruction takes a few cycles: the average is the **CPI** (cycles per instruction).

So a program's running time is:

> cycles = instructions × CPI
> time = cycles ÷ clock rate

A program of 1,500,000 instructions with a CPI of 2 needs 3,000,000 cycles; at 3 GHz that takes 3,000,000 ÷ 3,000,000,000 = 0.001 seconds = **1 millisecond**.

**Input**

One line: the clock rate in GHz (a number, possibly with decimals), the CPI (a whole number from 1 to 20) and the number of instructions (a whole number up to 10¹²).

**Output**

Two lines: `Cycles: ` and the number of cycles, and `Time: ` and the time in milliseconds with 3 decimals, followed by ` ms`.

**Things to know**

- 1 GHz is 1,000,000,000 cycles per second, so a clock of `g` GHz gives `g * 1e9` cycles per second.
- Keep the cycles in a `long`: 10¹² instructions don't fit in an `int`.
- `String.format("%.3f", x)` rounds to 3 decimals.
