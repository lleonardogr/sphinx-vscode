# Hash Table

`HashMap` is one of the most used classes in Java, and under the hood it is a simple idea: an array of **buckets**, a hash function that picks a bucket for each key, and a short list in each bucket for keys that collide. Build one yourself.

Run `q` operations on a table of whole-number keys and values. Each line has three numbers: an operation, a key and a value.

- `1 key value`: **put**: store the value under the key, replacing an old value.
- `2 key 0`: **get**: look the key up.
- `3 key 0`: **remove**: delete the key, if it is there.

At the end, print a report of the gets (how many found their key, how many didn't, and the sum of the values they found) and how many keys the table holds.

For the example (put 5 → 100, put 7 → 200, get 5, put 5 → 300, get 5, remove 7, get 7):

```
found: 2
missing: 1
sum: 400
size: 1
```

**Input**

- Line 1: `q` (1 ≤ q ≤ 200,000)
- Then `q` lines with the operation (1, 2 or 3), the key (0 to 1,000,000,000) and the value (0 to 1,000,000; ignored by get and remove)

**Output**

Four lines: `found: `, `missing: `, `sum: ` (the total of the values found by gets) and `size: ` (the keys in the table at the end).

**Things to know**

- No `java.util` maps or sets: arrays, and your own node class or parallel arrays.
- A list of pairs searched from the start is O(q) per operation: far too slow for 200,000 operations.
- Keep the buckets short by doubling the array when it gets about 3/4 full.
- The sum can pass `int`'s limit: use `long`.
