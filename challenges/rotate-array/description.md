# Rotate an Array

Rotate an array `k` steps to the **right**: every element moves `k` places forward, and the ones that fall off the end come back at the start.

Rotating `1 2 3 4 5` by `2` gives `4 5 1 2 3`.

**Input**

- Line 1: `n k` (1 ≤ n ≤ 1000, 0 ≤ k ≤ 1,000,000,000)
- Line 2: `n` integers

**Output**

The rotated array, with one space between numbers.

**Things to know**

- The element at index `i` ends up at index `(i + k) % n`. The `%` makes the index **wrap around** to the start.
- Rotating by `n` gives back the same array, so a huge `k` behaves like `k % n`. Don't rotate one step at a time a billion times.
- Writing the result into a **new array** is easier than moving elements in place.
