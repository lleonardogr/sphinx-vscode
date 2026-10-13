# Stats Through Pointers

A C function returns **one** value. When a function has several results, such as the minimum, the maximum and the mean of some data, the caller passes the **addresses** of variables to put them in: these are called output parameters, and the standard library is full of them (`scanf` is one).

Write

```c
void stats(const int *values, int n, int *min, int *max, double *mean)
```

and use it to print the statistics of the input, plus how many values are above the mean:

```
4 8 15 16 23   →   Min: 4
                   Max: 23
                   Mean: 13.20
                   Above mean: 3
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 1000)
- Line 2: `n` integers (they fit in an `int`)

**Output**

`Min: `, `Max: `, `Mean: ` with 2 decimals, and `Above mean: ` with the count of values strictly greater than the mean.

**Things to know**

- `const int *values` promises that `stats` only reads the array.
- Inside `stats`, write the results with `*min = …`. In `main`, pass `&low`, `&high` and `&mean`.
- Add the values in a `long long`: two values near the `int` limit already overflow an `int`.
