# Cache Simulator

A **cache** keeps copies of recently used memory close to the CPU. On a **miss**, it doesn't load just one byte: it loads a whole **block** of neighbouring bytes, hoping the program will use them next. That's why reading an array in order is fast.

Simulate the simplest kind, a **direct-mapped** cache with `L` lines and blocks of `B` bytes. For each address the CPU reads:

- its block is `address / B`, and the block can only go in line `block % L`;
- if that line already holds the block, it's a **hit**;
- otherwise it's a **miss**, and the block is loaded into that line, replacing whatever was there.

With 4 lines of 4 bytes, reading addresses 0 to 7 in order gives *miss hit hit hit miss hit hit hit*: one miss per block. Reading 0, 16, 32, 48, 0, 16 misses every time, because all those blocks fight for line 0.

**Input**

Three lines: `L` and `B` (1 to 64 each), the number of reads `n` (1 to 100), and the `n` addresses (from 0 to 1,000,000), separated by spaces. The cache starts empty.

**Output**

For each address, a line with the address and `hit` or `miss`. Then `Hits: h/n` and `Hit rate: ` with the percentage and one decimal, followed by `%`.

**Things to know**

- An `int[] cache = new int[L]` filled with `-1` can hold the block in each line.
- The address alone doesn't decide a hit: two addresses in the same block share a line and a load.
- Real caches have more tricks (several blocks per line, smarter replacement), but this one already shows why locality matters.
