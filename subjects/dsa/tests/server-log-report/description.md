# Server Log Report

*A test of units 1 to 4: hash maps, sorting, two pointers and time budgets.*

Every request to a web service leaves a log line: when it arrived, which user sent it, and how long the server took to answer. Once a day, the operations team reads a report built from the whole log, often hundreds of thousands of lines.

Read the log, in any order, and print:

- `users: ` how many different users sent requests;
- `top user: ` the user with the most requests (the smallest id on a tie), and `top user requests: ` how many;
- `p95 latency: ` the latency that 95% of requests didn't exceed: the value at position ⌈0.95 × n⌉ − 1 of the sorted latencies, counting from 0 (in integers, `(95 * n + 99) / 100 − 1`);
- `busiest minute: ` the most requests with times `t ≤ time < t + 60`, and `busiest minute starts: ` the earliest `t` where that happens (always a request time);
- `longest quiet: ` the longest gap between two requests in a row, in time order (0 if there is only one request).

For the example's 8 lines, sorted by time `40 45 100 100 101 130 160 900`:

```
users: 3
top user: 7
top user requests: 4
p95 latency: 2000
busiest minute: 4
busiest minute starts: 45
longest quiet: 740
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Then `n` lines with the time in seconds (0 to 1,000,000,000), the user id (1 to 1,000,000) and the latency in milliseconds (1 to 10,000)

**Output**

Seven lines, as in the example.

**Things to know**

- Anything that compares every request with every other is O(n²) and too slow for 200,000 lines.
- Sort copies of the times and of the latencies; count requests per user in a `HashMap<Integer, Integer>`.
- Requests can share the same second: they all count in a window, and the gap between them is 0.
