# Multi-Key Sort

A spreadsheet sorts by "score, highest first, then name". C's `qsort` can sort anything, because **you** pass it a pointer to a function that compares two elements: `qsort` calls it again and again and moves the elements by what it answers.

Read some people and a list of sort keys, and print the people sorted by those keys:

```
Ada 36 92          keys: -score name
Alan 41 88
Grace 85 92        →   Ada 36 92
Linus 54 75            Dennis 70 92
Barbara 79 88          Grace 85 92
Dennis 70 92           Alan 41 88
                       Barbara 79 88
                       Linus 54 75
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 100)
- Then `n` lines: a name (1 to 20 letters), an age and a score (whole numbers from 0 to 1000)
- Last line: 1 to 3 keys among `name`, `age` and `score`, separated by spaces; a `-` in front of a key sorts it in decreasing order

**Output**

The people, one per line as `name age score`, sorted by the first key, then by the second when the first is equal, and so on. People equal on every key keep their input order.

**Things to know**

- `qsort(order, n, sizeof order[0], compare)` sorts an array; `compare` gets two `const void *` pointers to elements and returns negative, 0 or positive.
- Sort an array of positions `0 … n − 1` and keep the data in parallel arrays: the comparison looks the people up by position. (Structs, in a later unit, make this tidier.)
- `qsort` doesn't keep equal elements in order by itself: compare the positions last.
