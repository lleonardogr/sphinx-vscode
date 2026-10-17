# Warmer Days

A weather app tells you, for each day, how long until it gets warmer. Read the daily temperatures and, for every day, find the next day with a **strictly higher** temperature. The app's summary shows:

- the **longest wait** for a warmer day, and the earliest day with that wait,
- how many days are **never** followed by a warmer one.

For `30 28 26 27 31 25 25`: day 1 (30) waits 4 days for 31, day 2 waits 3, days 3 and 4 wait 1, and days 5, 6 and 7 never get warmer.

```
longest wait: 4
from day: 1
never warmer: 3
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: `n` temperatures (−50 to 50)

**Output**

- `longest wait: ` and the longest wait in days (0 if no day ever gets warmer).
- `from day: ` and the earliest day with that wait, counting from 1, or `none` if no day gets warmer.
- `never warmer: ` and the count.

**Things to know**

- Checking the following days from each day is O(n²). With 200,000 equal temperatures, that is 20 billion comparisons.
- A **monotonic stack** of the days still waiting solves it in one pass: each day is pushed once and popped at most once.
- `Deque<Integer> stack = new ArrayDeque<>()` with `push`, `peek` and `pop`; store day numbers (indexes), not temperatures.
