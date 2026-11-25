# Longest Streak

A fitness app logs the days a user exercised, as day numbers, in no particular order and sometimes twice. The badge screen shows the **longest streak**: the most consecutive days with exercise.

For the days `10 4 20 1 3 2 11` the longest streak is 1, 2, 3, 4:

```
longest streak: 4
starts on day: 1
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: `n` day numbers (0 to 1,000,000,000), in any order, possibly repeated

**Output**

`longest streak: ` and its length, then `starts on day: ` and its first day (the earliest one on a tie).

**Things to know**

- Looking for d + 1 by scanning the whole list is O(n) per day, O(n²) in total.
- A `HashSet<Integer>` answers `contains(d + 1)` in about O(1).
- Only start counting from a day whose day before is missing, or long streaks are counted over and over.
