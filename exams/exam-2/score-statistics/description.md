# Score Statistics

Read the scores of a class and print a summary:

```
Highest: 90
Lowest: 38
Passed: 3 of 5
```

A score of **60 or more** passes. The example is for the scores `72 45 90 60 38`.

**Input**

- Line 1: `n`, the number of students (1 to 100)
- Line 2: `n` scores from 0 to 100

**Output**

The three lines above.

**Things to know**

- Store the scores in an `int[]` and walk through it with a loop.
- Start `highest` and `lowest` with the first score, so you don't need special starting values.
- Count the passing scores with a variable that starts at 0.
