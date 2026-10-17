# Exam Scores

A national exam has hundreds of thousands of entries, each scored from 0 to 100. The report lists how many students got each score, from the top down, and the median.

With only 101 possible scores there is no need to compare scores at all: **count** them. One pass fills the counters, and the counters already are the sorted scores.

For the scores `70 85 70 100 55 85 70`:

```
100: 1
85: 2
70: 3
55: 1
median: 70
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: `n` scores from 0 to 100

**Output**

- One line per score that appears, from the highest down: the score, `: ` and how many students got it.
- Then `median: ` and the value at position (n − 1) / 2 of the sorted scores, counting from 0. With an even `n` that is the lower of the two middle values.

**Things to know**

- `int[] counts = new int[101];` has one counter per possible score, and `counts[score]++` adds one.
- Counting takes O(n + 101) steps, faster than any sort that compares scores.
- Don't sort: the challenge is to let the counters do it.
