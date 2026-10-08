# Merge Step

Two servers write logs in time order, and you want **one** log in time order. You could join them and sort everything, but there's a faster way: since each list is already sorted, the smallest remaining number is always at the **front** of one of them. Compare the two fronts, take the smaller, and repeat. This **merge** is the heart of merge sort, and it needs at most n + m − 1 comparisons instead of a full sort.

When the two fronts are equal, take the one from the first list. When one list runs out, the rest of the other is copied without comparisons.

For `1 4 9 12` and `2 3 10`: 1 < 2, 4 > 2, 4 > 3, 4 < 10, 9 < 10, 12 > 10, then 12 is copied. That's **6 comparisons**.

Read the two lists, check that each is sorted, and merge them.

**Input**

Four lines: the count `n` (1 to 100), the `n` numbers of list A, the count `m` (1 to 100) and the `m` numbers of list B.

**Output**

If list A isn't in increasing order (equal neighbours are fine), print `List A is not sorted`; else if list B isn't, print `List B is not sorted`. Otherwise print two lines: the merged numbers separated by spaces, and `Comparisons: C`.

**Things to know**

- One index per list, `i` and `j`, moving forward independently.
- `while (i < n && j < m)` runs only while both lists still have numbers.
