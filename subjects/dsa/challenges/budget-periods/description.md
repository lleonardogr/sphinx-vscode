# Budget Periods

A personal finance app records how much your balance changed each day, up or down. It looks for **periods**, runs of consecutive days, whose changes add up to exactly `k`: with `k = 0`, the stretches where spending and income cancelled out.

Count those periods and find the longest.

For `k = 5` and the changes `2 3 -1 4 -3 5`, four periods add up to 5: days 1–2 (2 + 3), days 1–5, days 3–6 and day 6 alone. The longest is days 1–5:

```
periods: 4
longest: 5
```

**Input**

- Line 1: `n` and `k` (1 ≤ n ≤ 200,000; −1,000,000,000 ≤ k ≤ 1,000,000,000)
- Line 2: `n` daily changes (−1,000 to 1,000)

**Output**

`periods: ` and how many periods add up to `k`, then `longest: ` and the number of days in the longest one (0 if there are none).

**Things to know**

- Adding up every period is O(n²): 20 billion periods for 200,000 days.
- With prefix sums, days `i+1..j` add up to `prefix[j] − prefix[i]`, and a `HashMap<Long, Integer>` of the prefix sums seen so far finds the matching starts in one lookup.
- There can be over 2 × 10¹⁰ periods (all zeros and `k = 0`): use `long` for the count and for the totals.
