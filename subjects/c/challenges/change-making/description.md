# Change Making

How many different ways can a cashier make 1 dollar from coins of 50, 25, 10, 5 and 1 cents? Counting them one by one is hopeless, but **recursion** splits the question into smaller copies of itself: every way either uses a 50-cent coin, and then still has to make 50 cents, or never uses one, and makes 1 dollar from the smaller coins.

Read an amount in cents and print how many ways make it, ignoring the order of the coins. For 11 cents there are 4:

```
10 + 1        5 + 5 + 1        5 + 1 + 1 + 1 + 1 + 1        eleven 1s
```

**Input**

One whole number: the amount in cents (0 ≤ amount ≤ 300).

**Output**

The number of ways.

**Things to know**

- A function `ways(amount, k)` that counts the ways using only the coins from the k-th one on is enough: either use coin k once more, or skip to coin k + 1.
- An amount of 0 has exactly one way: no coins at all.
- Solve it without loops: the recursion does the counting.
