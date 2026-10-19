# BST Builder

A **binary search tree** keeps, at every node, the smaller keys on the left and the bigger ones on the right. Databases, file systems and Java's own `TreeMap` are built on this idea. Build one by inserting keys in the given order, then describe it.

For the keys `8 3 10 1 6 14 4 7 13` (the tree in the unit's reading guide):

```
in-order: 1 3 4 6 7 8 10 13 14
pre-order: 8 3 1 6 4 7 10 14 13
post-order: 1 4 7 6 3 13 14 10 8
height: 4
leaves: 4
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 1,000)
- Line 2: `n` different integers (−100,000 to 100,000), inserted in this order

**Output**

- `in-order: `, `pre-order: ` and `post-order: `, each followed by the keys in that traversal, separated by spaces.
- `height: ` and the number of levels (a single node has height 1).
- `leaves: ` and how many nodes have no children.

**Things to know**

- Insert: start at the root and go left for a smaller key or right for a bigger one, until you find an empty spot.
- In-order (left, node, right) lists a BST's keys sorted: a good check of your insert.
- Keys inserted in sorted order make a chain: the height is then `n`.
- No `TreeMap`, `TreeSet` or sorting: the tree is the exercise.
