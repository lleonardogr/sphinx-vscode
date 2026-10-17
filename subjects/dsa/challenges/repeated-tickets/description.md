# Repeated Tickets

At a festival gate, scanners log every ticket that goes through. A ticket scanned more than once was probably shared or copied, so security wants to know how many tickets were repeated.

Read the ticket ids and print how many **different** ids appear more than once.

For `5 3 5 9 3 5 1`, ids 5 and 3 repeat (5 even three times), so the answer is:

```
2
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: `n` ticket ids separated by spaces (1 ≤ id ≤ 1,000,000,000)

**Output**

One number: how many different ids appear at least twice.

**Things to know**

- Comparing every pair of tickets is about n²/2 = 20 billion comparisons for 200,000 tickets: minutes, not seconds. One hidden test is that big.
- `set.add(x)` returns `false` when `x` is already in a `HashSet`, and it takes about the same time however big the set is.
- Count each repeated id once, however many times it appears.
