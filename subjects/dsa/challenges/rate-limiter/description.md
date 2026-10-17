# Rate Limiter

APIs protect themselves with **rate limits**: "at most L requests in any w seconds". Before switching one on, an engineer replays yesterday's traffic to see how busy it got and how many requests the limit would have refused.

Read `n` request times, in seconds and in any order, and work out two things:

1. **The busiest window**: the most requests in `w` consecutive seconds, meaning times with `s ≤ t < s + w`, and the earliest `s` where such a window starts. (`s` is always one of the request times.)
2. **What the limiter rejects**: going through the requests in time order, a request at time `t` is accepted when fewer than `L` *accepted* requests have times with `t − w < time ≤ t`. Otherwise it is rejected, and it doesn't count against later requests.

For `w = 10`, `L = 2` and the times `14 1 5 25 12 3 13`, sorted `1 3 5 12 13 14 25`:

- The window starting at 5 holds 5, 12, 13 and 14: 4 requests, more than any other.
- The limiter accepts 1 and 3, rejects 5 (1 and 3 are within the last 10 seconds), accepts 12 and 13, rejects 14 (12 and 13) and accepts 25.

```
busiest start: 5
busiest count: 4
rejected: 2
```

**Input**

- Line 1: `n`, `w` and `L` (1 ≤ n ≤ 200,000; 1 ≤ w ≤ 1,000,000,000; 1 ≤ L ≤ n)
- Line 2: `n` request times (0 ≤ t ≤ 1,000,000,000), in any order; the same second can repeat

**Output**

Three lines: `busiest start: `, `busiest count: ` and `rejected: `, as in the example.

**Things to know**

- Sort the times first: `Arrays.sort` is fine here (the next unit shows how sorting works).
- **Two pointers**: as a window's start moves right, its end only moves right too, so both cross the array once.
- The accepted requests are already in time order as you accept them, so a second pair of pointers works for the limiter.
- Requests in the same second are handled one at a time, in any order: they are identical.
