# Binary Search

Looking for a value in a **sorted** array doesn't require checking every element. **Binary search** looks at the middle element and throws away the half that can't contain the value, again and again.

Use exactly this algorithm and count its **steps**:

1. `low = 0`, `high = n - 1`
2. While `low <= high`: `mid = (low + high) / 2`. That is one step.
   - `numbers[mid]` equals the value: found it.
   - `numbers[mid]` is smaller: `low = mid + 1`.
   - `numbers[mid]` is bigger: `high = mid - 1`.

For `2 5 8 12 16 23 38`, searching `23` checks index 3 (`12`), then index 5 (`23`):

```
23 found at index 5, steps: 2
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 100,000)
- Line 2: `n` different integers in increasing order
- Line 3: `q`, the number of searches; then `q` lines with a value each

**Output**

For each value: `x found at index i, steps: s`, or `x not found, steps: s`.

**Things to know**

- Each step halves the range, so even 100,000 elements need at most 17 steps. A loop over every element would take up to 100,000.
- `(low + high) / 2` uses integer division, so `mid` is always a valid index.
- Write the search yourself, without `Arrays.binarySearch`.
