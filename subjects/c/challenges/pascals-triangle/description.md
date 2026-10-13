# Pascal's Triangle

Each number in Pascal's triangle is the sum of the two above it, and the number in row `r`, position `k` is **C(r, k)**: the number of ways to choose `k` things out of `r`. Row `r` has `r + 1` numbers, so a rectangular 2D array would waste almost half its memory. In C you can allocate an array of **rows of different lengths**: an array of pointers, each pointing to a row of its own size.

```
row 0:        1
row 1:       1 1
row 2:      1 2 1
row 3:     1 3 3 1
row 4:    1 4 6 4 1      C(4,2) = 6
```

Build the first `n` rows, then answer questions about them:

```
5 3          Stored: 15
4 2     →    C(4,2) = 6
0 0          C(0,0) = 1
3 1          C(3,1) = 3
```

**Input**

- Line 1: `n`, the number of rows (1 ≤ n ≤ 67), and `q`, the number of questions (1 ≤ q ≤ 100)
- Then `q` lines with `r` and `k` (0 ≤ k ≤ r < n)

**Output**

`Stored: ` and how many numbers the triangle holds, `n(n + 1)/2`, then `C(r,k) = ` and the value for each question.

**Things to know**

- `long long **rows = malloc(n * sizeof *rows);` gives `n` row pointers; `rows[r] = malloc((r + 1) * sizeof *rows[r]);` gives row `r`.
- Then `rows[r][k]` works like a 2D array.
- Every `malloc` needs its `free`: each row, then the array of pointers.
- Row 66 holds C(66, 33) ≈ 7.2 × 10¹⁸, which still fits in a `long long`.
