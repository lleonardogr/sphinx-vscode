# Grade Report

A teacher needs a quick report of a test. Read the grades and print the average, the highest and lowest grade, and how many students passed. A grade of **60 or more** passes.

**Input**

- Line 1: the number of students `n` (1 ≤ n ≤ 100)
- Line 2: `n` grades from 0 to 100

**Output**

Four lines, with the average to **two** decimal places:

```
Average: 72.50
Highest: 95
Lowest: 40
Passed: 3 of 4
```

**Things to know**

- One loop can track the sum, the highest grade, the lowest grade and how many passed.
- Divide as a `double` for the average, `(double) sum / n`, and print it with `"%.2f"`.
- Start the highest and lowest at the first grade, or at `Integer.MIN_VALUE` and `Integer.MAX_VALUE`.
