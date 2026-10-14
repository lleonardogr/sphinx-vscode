# LRU Cache

Browsers, databases and processors keep recently used data in a small, fast **cache**. When it is full and something new arrives, an **LRU** (least recently used) cache throws out the item that hasn't been used for the longest time.

Simulate one. `get` reads a key and `put` stores a value under a key; both count as using the key:

```
capacity 2
put 1 10
put 2 20
get 1           10
put 3 30        evicted 2      (2 is the least recently used: 1 was just read)
get 2           miss
get 3           30
get 1           10
                hits=3 misses=1
```

**Input**

- Line 1: the capacity (1 ≤ capacity ≤ 1000)
- Then commands until the end of the input: `put K V` or `get K`, with keys from 0 to 9999 and integer values

**Output**

- `get K`: the value, or `miss` when `K` isn't in the cache;
- `put K V` prints nothing, unless it adds a new key to a full cache: then `evicted K2`, the key it threw out;
- at the end, `hits=H misses=M` for the `get` commands.

`put` on a key already in the cache updates its value (and uses it); it never evicts.

**Things to know**

- A **doubly linked list** in use order makes "move to the front" and "remove the last" a few pointer changes.
- An array of 10,000 pointers, indexed by key, finds a key's node without searching.
- Free every node you evict, and the rest at the end.
