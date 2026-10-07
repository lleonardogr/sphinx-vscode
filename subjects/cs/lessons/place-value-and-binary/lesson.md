## In short

In decimal, each position is worth **10 times** the one to its right: 4705 is 4 × 1000 + 7 × 100 + 0 × 10 + 5. **Binary** works the same way with base **2**: there are only the digits 0 and 1, and the positions are worth 1, 2, 4, 8, 16, … To read a binary number, add the place values that have a 1:

![The byte 10110010: 128 + 32 + 16 + 2 = 178](place-values.svg)

To go the other way, divide by 2 again and again; the remainders, read from the last to the first, are the bits: 13 → `1101`.

Long binary numbers are hard to read, so programmers use **hexadecimal**, base **16**: digits 0–9 and then A–F for 10 to 15, with positions worth 1, 16, 256, … Because 16 = 2⁴, **one hex digit is exactly 4 bits**, and a byte is always two hex digits: `1011 0010` is `B2`. That's why colors (`#FF8800`), memory addresses and error codes are written in hex. **Octal** (base 8) groups bits in threes and is rarer today.

Java can write all of them: `0b1011` is binary, `0x2F` is hex, and a number that starts with `0`, like `010`, is **octal**, so it means 8, not 10.

<!-- readings -->

## Check yourself

1. What is `1011 0010` in decimal, and in hex?
2. Why is a byte always exactly two hex digits?
3. What does `IO.println(010 + 1)` print, and why?
