# Pair Sum: Slow and Fast

Read a list of numbers and a target, and find two numbers (at different positions) that add up to the target. Do it in two ways and compare how many sums each one checks.

- **Brute force** checks every pair in order: (1st, 2nd), (1st, 3rd), …, (2nd, 3rd), … and stops at the first pair that works. It can check about n²/2 pairs: it grows like **n²**.
- **Two pointers** works on a **sorted copy**. It starts with the smallest and the largest number. If their sum is too small, it moves to the next bigger number on the left side; if too big, to the next smaller number on the right side. It checks at most n − 1 sums: it grows like **n** (plus the sorting, about n log n).

**Input**

Three lines: the count `n` (2 ≤ n ≤ 100), the `n` numbers, and the target.

**Output**

Three lines:

- `Pair: A + B`, with the first pair brute force finds (A comes first in the list), or `Pair: none`.
- `Brute force: ` and the number of sums it checked.
- `Two pointers: ` and the number of sums it checked (sorting isn't counted).

**Things to know**

- For brute force use the original order; for two pointers sort a copy: `int[] sorted = Arrays.copyOf(numbers, n); Arrays.sort(sorted);`
- Two pointers stop when the sum matches or when the pointers meet (`lo >= hi`).
- Both find a pair whenever one exists, but on a long list the difference in work is huge.
