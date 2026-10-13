# Ring Buffer

A sensor sends a reading every second, and the display shows the average of the last few, to smooth out the noise. Microcontrollers have little memory, so they keep exactly the last `k` readings in an array of `k` slots, writing each new reading over the oldest one and going back to the start when they reach the end. This is a **ring buffer** (or circular buffer), used in audio, keyboards and network cards.

Read the readings and, after each one, print the average of the last `k` (or of all of them while there are fewer than `k`). When a reading replaces an older one, also say which:

```
k = 3:   10  →  10.00
         20  →  15.00
         30  →  20.00
         40  →  30.00 (dropped 10)
         50  →  40.00 (dropped 20)
```

**Input**

- Line 1: `k` (1 ≤ k ≤ 100) and `n`, the number of readings (1 ≤ n ≤ 10,000)
- Line 2: `n` whole readings from −1000 to 1000

**Output**

One line per reading: the average with 2 decimals, followed by ` (dropped X)` when the reading pushed out the oldest one, `X`.

**Things to know**

- The array has `k` slots and an index for the next write. After the last slot, the index goes back to 0, often written `(i + 1) % k`.
- Once the buffer is full, the slot about to be written holds the oldest reading.
- A running sum avoids adding up the whole window every time.
