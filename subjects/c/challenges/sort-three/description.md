# Sort Three

In the Functions unit, a `swap(int x, int y)` couldn't change anything: it swapped copies. With **pointers** a function gets the addresses of the caller's variables and can change the variables themselves. This is what `scanf` has been doing all along with `&x`.

Write `void sort3(int *a, int *b, int *c)`, which puts the three variables it points to in increasing order, and use it on each line of the input:

```
3 1 2    →    1 2 3
5 5 1    →    1 5 5
```

**Input**

- Line 1: `t`, the number of lines (1 ≤ t ≤ 100)
- Then `t` lines with three integers between −10⁹ and 10⁹

**Output**

Each line's three numbers in increasing order.

**Things to know**

- In `sort3`, `a` is an address and `*a` is the variable at that address: `*a = 5;` changes the caller's variable.
- Call it with the addresses: `sort3(&x, &y, &z)`, then print `x`, `y` and `z`.
- No arrays: the point is three separate variables, changed through pointers.
