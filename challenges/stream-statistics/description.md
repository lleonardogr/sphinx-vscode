# Stream Statistics

Streams of numbers come with ready-made calculations. Read a list of numbers and print some statistics about them.

**Solve it without `for` or `while` loops.**

**Input**

One line of integers separated by single spaces.

**Output**

```
Count: 6
Sum: 108
Min: 4
Max: 42
Average: 18.00
```

The average has **two** decimal places.

**Things to know**

- An `IntStream` has `.sum()`, `.min()`, `.max()`, `.average()` and `.count()`.
- `.summaryStatistics()` calculates **all of them at once** and returns an `IntSummaryStatistics` with `getCount()`, `getSum()`, `getMin()`, `getMax()` and `getAverage()`.
- A stream can be used only once, so `summaryStatistics()` saves you from building it five times.
