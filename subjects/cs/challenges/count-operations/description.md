# Count the Operations

To compare algorithms, computer scientists **count steps** instead of timing them. Read a number `n` and count how many times the body of each of these loops runs:

```java
// Single loop
for (int i = 0; i < n; i++) { count++; }

// Nested loops
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { count++; }
}

// Halving loop
int m = n;
while (m > 1) { m = m / 2; count++; }
```

For n = 8 the single loop runs 8 times, the nested loops 64 times and the halving loop 3 times (8 → 4 → 2 → 1).

**Input**

A whole number `n` (1 ≤ n ≤ 3000).

**Output**

Three lines: `Single loop: ` and its count, `Nested loops: ` and its count, `Halving loop: ` and its count.

**Things to know**

- Write the three loops and count, as above: one counter per loop.
- The single loop grows like n, the nested loops like n² and the halving loop like log₂ n. Try n = 1000 and compare.
- Count by running the loops: `Math.log` and `Math.pow` aren't allowed here.
