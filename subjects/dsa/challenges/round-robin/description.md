# Round-Robin Scheduler

A computer runs far more programs than it has processor cores, so the operating system takes turns: each program runs for a short **time slice**, and if it isn't finished it goes to the back of the line. This is **round robin**, and the line is a queue.

Simulate it. Every process arrives at time 0, in input order. Repeatedly take the process at the front, run it for the time slice (or less, if it needs less), and send it to the back if it still needs time.

For a slice of 3 and the processes `A 5`, `B 2`, `C 4`: A runs 0–3, B runs 3–5 and finishes, C runs 5–8, A runs 8–10 and finishes, C runs 10–11 and finishes. Each process waited its finish time minus the time it needed: A 5, B 3 and C 7.

```
B finishes at 5
A finishes at 10
C finishes at 11
average waiting: 5.00
```

**Input**

- Line 1: `n` and the time slice `q` (1 ≤ n ≤ 1,000; 1 ≤ q ≤ 100)
- Then `n` lines with a process name (letters and digits) and the time it needs (1 to 1,000)

**Output**

One line per process, in the order they finish: the name, ` finishes at ` and the time. Then `average waiting: ` and the average waiting time with two decimals.

**Things to know**

- `ArrayDeque` is a queue: `offer(x)` adds at the back, `poll()` removes from the front.
- Keep each process's name and remaining time together, such as in a `record` or an `int[]` with a parallel name array.
- Waiting time = finish time − time needed, since everyone arrives at 0.
