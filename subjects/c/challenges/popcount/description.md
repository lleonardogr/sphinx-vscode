# Count the Bits

How many 1 bits does a number have? Error-detecting codes, chess engines, compression and cryptography ask it so often that processors have an instruction for it, **popcount**. Write it yourself, together with two related answers: the **parity** (whether the count is even or odd, the idea behind a parity bit) and the position of the **highest** 1 bit.

```
12  is 1100   →   12: ones=2 parity=even highest=3
7   is 111    →   7: ones=3 parity=odd highest=2
0             →   0: ones=0 parity=even highest=none
```

**Input**

- Line 1: `t` (1 ≤ t ≤ 100)
- Then `t` whole numbers from 0 to 4,294,967,295 (they fit in a `uint32_t`)

**Output**

For each number: `x: ones=N parity=even|odd highest=B`, where bits are numbered from 0 (the rightmost), and `B` is `none` for 0.

**Things to know**

- `(x >> b) & 1` is bit `b` of `x`.
- Read and print a `uint32_t` with `%u`.
- Compiler built-ins such as `__builtin_popcount` are not allowed: the point is the shifts and masks.
