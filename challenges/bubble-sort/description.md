# Bubble Sort

**Bubble sort** sorts an array by making **passes**. In each pass, walk from the start to the end comparing each pair of neighbours, and **swap** them when the left one is bigger. Big numbers "bubble up" to the end.

After each pass that swapped something, print the array. Stop as soon as a pass makes **no swaps** (don't print that pass), then print the sorted array.

For `5 1 4 2 8`:

```
Pass 1: 1 4 2 5 8
Pass 2: 1 2 4 5 8
Sorted: 1 2 4 5 8
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 100)
- Line 2: `n` integers

**Output**

One `Pass i:` line per pass with swaps, then `Sorted:` with the result.

**Things to know**

- A pass compares `a[j]` and `a[j + 1]` for `j` from `0` to `n - 2`. Stopping at `n - 2` keeps `j + 1` inside the array.
- Swapping two elements needs a **temporary variable**.
- A `boolean swapped` tells you when the array is already sorted, so you can stop early. Write the sort yourself, without `Arrays.sort`.
