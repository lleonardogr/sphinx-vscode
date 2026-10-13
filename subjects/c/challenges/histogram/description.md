# Histogram

A teacher wants to see at a glance how a test went: how many scores fell between 0 and 9, between 10 and 19, and so on. A **histogram** answers it with one bar per range, and in code it is a classic use of an array: one counter per range, with the score itself deciding which counter goes up.

Read the scores and print one bar per range, then the range with the most scores:

```
  0-9  |
 10-19 |
 20-29 |
 30-39 |
 40-49 |
 50-59 |*
 60-69 |*
 70-79 |***
 80-89 |*
 90-100|**
Most common: 70-79
```

**Input**

- Line 1: `n`, the number of scores (0 ≤ n ≤ 1000)
- Line 2: `n` whole scores from 0 to 100

**Output**

Ten lines, one per range: the range written with `printf("%3d-%-3d|", low, high)`, then one `*` per score in it. The last range is 90 to 100. Then `Most common: ` and the range with the most scores (the lowest one if there is a tie), unless there are no scores.

**Things to know**

- `int counts[10] = {0};` starts every counter at 0.
- `score / 10` is the range's index, except for 100.
- `%-3d` is left-aligned in 3 characters: `9` becomes `9  `.
