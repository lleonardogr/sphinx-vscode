# Dice Roller

Games, simulations and tests need random numbers, but a computer follows instructions: it can only **compute** numbers that look random. C's own `rand()` is often a **linear congruential generator**, a few lines you can write yourself. Given the same **seed**, it gives the same sequence every time, which is exactly what you want for a replay or a test.

The generator keeps a 32-bit `state`. Each call does:

```
state = state × 1103515245 + 12345     (kept to 32 bits)
value = bits 16 to 30 of state          ((state >> 16) & 0x7FFF, from 0 to 32767)
```

A die roll is `value % 6 + 1`.

Read a seed and a number of rolls, print the rolls, then how many times each face came up. With seed 1 and 10 rolls:

```
3 5 4 2 2 6 1 4 1 1
1: 3
2: 2
3: 1
4: 2
5: 1
6: 1
```

**Input**

One line: the seed (0 to 4294967295) and `n`, the number of rolls (0 ≤ n ≤ 1000).

**Output**

The rolls on one line, separated by spaces (an empty line when `n` is 0), then one line per face: `1: ` and its count, up to `6: `.

**Things to know**

- Write the generator as functions: `next_random()` and `roll_die()`, with the state in a `static` variable, so it survives between calls and no other code can touch it.
- `uint32_t` from `<stdint.h>` is exactly 32 bits, and unsigned arithmetic wraps around, so `state * 1103515245u` is kept to 32 bits by itself.
- `>>` shifts the bits right and `& 0x7FFF` keeps the lowest 15 of them.
