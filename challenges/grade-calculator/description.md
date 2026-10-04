# Grade Calculator

Convert a test score into a letter grade.

| Score    | Grade |
|----------|-------|
| 90 – 100 | A     |
| 80 – 89  | B     |
| 70 – 79  | C     |
| 60 – 69  | D     |
| 0 – 59   | F     |

**Input**

An integer score between 0 and 100.

**Output**

The letter grade.

**Things to know**

- An `if / else if / else` chain checks the conditions from top to bottom and runs only the **first** one that is true.
- Because of that order, once you have checked `score >= 90`, the next check only needs `score >= 80`.
- Test the boundaries yourself: 90, 89, 60 and 59 are where mistakes hide.
