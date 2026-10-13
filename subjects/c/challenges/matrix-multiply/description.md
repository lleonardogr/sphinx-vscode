# Matrix Multiply

Graphics, machine learning and physics simulations spend much of their time multiplying matrices. The sizes come with the data, so the program can't know them when it is written: the matrices must be **allocated while it runs**.

The product of an `r × k` matrix A and a `k × c` matrix B is the `r × c` matrix whose entry (i, j) is

```
A[i][0]·B[0][j] + A[i][1]·B[1][j] + … + A[i][k−1]·B[k−1][j]
```

The product can be big, so print its size, the sum of all its entries and its largest entry:

```
A = 1 2 3     B = 7  8      A×B =  58  64
    4 5 6         9 10             139 154
                 11 12

→  Size: 2 x 2
   Sum: 415
   Largest: 154
```

**Input**

- Line 1: `r`, `k` and `c` (each from 1 to 300)
- Then A, `r` lines of `k` integers, and B, `k` lines of `c` integers, each from −100 to 100

**Output**

`Size: r x c`, `Sum: ` and `Largest: `.

**Things to know**

- An array of row pointers works like a 2D array: `int **a = malloc(r * sizeof *a);` and then `a[i] = malloc(k * sizeof *a[i]);` for each row.
- An entry can reach 300 × 100 × 100 = 3,000,000 and the sum 2.7 × 10¹¹: use `long long`.
- Free each row and each array of row pointers.
- Fixed-size arrays are not allowed: size everything from the input.
