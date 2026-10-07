# Average Memory Access Time

Main memory (RAM) is about **100 times slower** than the processor. To hide that, processors keep recently used data in a small, fast **cache**. When the data is in the cache it is a **hit** and takes about 1 nanosecond; when it isn't, it is a **miss**, and the processor also has to wait for main memory.

The average time per access is:

> average = cache time + miss rate × memory time

With a 1 ns cache, 100 ns memory and a 95% hit rate, the miss rate is 5%, so the average is 1 + 0.05 × 100 = **6 ns**: almost 17 times faster than always going to memory.

**Input**

One line: the cache time in nanoseconds, the memory time in nanoseconds and the hit rate in percent (from 0 to 100). Any of them may have decimals.

**Output**

Two lines: `Average: ` and the average time with 2 decimals followed by ` ns`, and `Speedup: ` and memory time ÷ average with 2 decimals followed by `x`.

**Things to know**

- Turn the percentage into a fraction first: 95% is 0.95, so the miss rate is 1 − 0.95 = 0.05.
- Every access pays the cache time; only misses pay the memory time too.
- `String.format("%.2f", x)` rounds to 2 decimals.
