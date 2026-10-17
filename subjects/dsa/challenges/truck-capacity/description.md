# Truck Capacity

A warehouse must ship `n` packages in the order they come off the conveyor belt, within `d` days. Every day one truck is loaded: packages go on in order until the next one would pass the truck's capacity, and then the truck leaves. Bigger trucks cost more, so the company wants the **smallest capacity** that ships everything in `d` days or fewer.

For the weights `3 2 2 4 1 4` and `d = 3`:

- Capacity 6: `[3 2] [2 4] [1 4]`, 3 days. It works.
- Capacity 5: `[3 2] [2] [4 1] [4]`, 4 days. Too many.

So the answer is:

```
6
```

**Input**

- Line 1: `n` and `d` (1 ≤ d ≤ n ≤ 200,000)
- Line 2: `n` package weights (1 ≤ weight ≤ 100,000)

**Output**

The smallest capacity that ships every package in at most `d` days.

**Things to know**

- Checking one capacity is a simple simulation over the packages.
- If a capacity works, every bigger capacity works too. So "does capacity c work?" is a yes/no question you can binary-search, between the heaviest package and the total weight.
- Trying every capacity from the heaviest package upward can mean billions of simulations.
- The total weight can reach 2 × 10¹⁰, past `int`'s limit: use `long`.
