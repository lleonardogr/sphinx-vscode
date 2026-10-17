# Calendar Merge

A meeting room's booking system shows each day as busy blocks. Meetings that overlap, or where one ends exactly when the next starts, form one block.

Read the meetings, in any order, each as a start minute and a length, and print:

- how many busy **blocks** there are,
- the total **busy** time,
- the **longest free gap** between two blocks (0 if there is only one block).

A meeting that starts at `start` and lasts `length` minutes occupies the times `start ≤ t < start + length`.

For the meetings `8 2`, `1 2`, `15 3`, `2 4` and `10 2`, that is `[8, 10) [1, 3) [15, 18) [2, 6) [10, 12)`, the blocks are `[1, 6)`, `[8, 12)` and `[15, 18)`:

```
blocks: 3
busy: 12
longest free gap: 3
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Then `n` lines with `start` and `length` (0 ≤ start ≤ 1,000,000,000; 1 ≤ length ≤ 100,000)

**Output**

Three lines: `blocks: `, `busy: ` and `longest free gap: `, as in the example.

**Things to know**

- Comparing every meeting with every other is far too slow for 200,000 meetings. After sorting by start time, one pass is enough.
- A `record Meeting(int start, int end)` and `list.sort(Comparator.comparingInt(Meeting::start))` sort by start. With an `int[][]`, use `Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]))`.
- A meeting can lie completely inside another one: the block's end is the largest end seen so far.
