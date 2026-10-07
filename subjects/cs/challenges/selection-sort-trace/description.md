# Selection Sort Trace

**Selection sort** is one of the simplest sorting algorithms. On pass 1 it finds the **smallest** number and swaps it into the first position; on pass 2 it finds the smallest of the rest and swaps it into the second position, and so on. After `n − 1` passes the list is sorted.

For `29 10 14 37 13`:

| Pass | Smallest of the rest | List after the pass |
|------|----------------------|---------------------|
| 1 | 10 | `10 29 14 37 13` |
| 2 | 13 | `10 13 14 37 29` |
| 3 | 14 (already in place) | `10 13 14 37 29` |
| 4 | 29 | `10 13 14 29 37` |

Read a list, sort it with selection sort and show each pass.

**Input**

Two lines: the count `n` (2 ≤ n ≤ 50) and the `n` numbers.

**Output**

The list after each of the `n − 1` passes, one line each with the numbers separated by spaces. Then `Comparisons: ` and the number of comparisons between two numbers, and `Swaps: ` and the number of swaps. A pass whose smallest number is already in place doesn't swap.

**Things to know**

- To find the smallest of positions `i` to `n − 1`, start with `min = i` and compare `numbers[j] < numbers[min]` for every later `j`: one comparison each.
- Selection sort always makes `n × (n − 1) / 2` comparisons, so it grows like **n²**.
- Sort it yourself: `Arrays.sort` isn't allowed here.
