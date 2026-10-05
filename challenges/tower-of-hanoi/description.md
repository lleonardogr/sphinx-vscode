# Tower of Hanoi

There are three pegs, `A`, `B` and `C`. Peg `A` holds `n` disks, the biggest at the bottom. Move them all to peg `C`, following two rules:

1. Move only one disk at a time (the top disk of a peg).
2. Never put a bigger disk on top of a smaller one.

Disks are numbered from `1` (smallest) to `n` (biggest). For `n = 2`:

```
Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C
Total moves: 3
```

**Input**

The number of disks `n` (1 ≤ n ≤ 10).

**Output**

Every move, in order, then `Total moves: m`. Use the solution with the fewest moves (`2ⁿ − 1`), which the recursive idea below produces.

**Things to know**

- The recursive idea: to move `n` disks from `A` to `C`, move the top `n − 1` disks to `B`, move disk `n` to `C`, then move the `n − 1` disks from `B` to `C`.
- Each recursive call swaps the roles of the pegs: the same method moves disks between **any** two pegs, using the third as the spare.
- A field like `moves`, outside the method, keeps its value across all the recursive calls.
