## Why it matters

A program that works on 10 test inputs can freeze on 10 million real ones. **Big O notation** describes how an algorithm's work grows as its input grows, so you can predict that before it happens, and compare algorithms without timing them on a particular computer.

## Counting steps, not seconds

Seconds depend on the computer, but the number of basic steps (comparisons, additions, loop turns) depends only on the algorithm and the input size, which we call **n**. Big O keeps only the part that matters when n gets large:

- Constants are dropped: 3n steps and n steps are both **O(n)**.
- Smaller terms are dropped: n² + 5n + 100 is **O(n²)**, because for big n the n² part is all that matters.

## The common classes

| Big O | Name | Example |
|-------|------|---------|
| O(1) | constant | reading `array[i]`, adding two numbers |
| O(log n) | logarithmic | binary search |
| O(n) | linear | linear search, summing a list |
| O(n log n) | linearithmic | good sorting (`Arrays.sort`) |
| O(n²) | quadratic | nested loops over the list, selection sort |
| O(2ⁿ) | exponential | trying every subset of n items |

How many steps each one takes:

| n | log₂ n | n log₂ n | n² | 2ⁿ |
|---|--------|----------|----|----|
| 10 | 3 | 33 | 100 | 1,024 |
| 1,000 | 10 | 10,000 | 1,000,000 | a 302-digit number |
| 1,000,000 | 20 | 20,000,000 | 10¹² | — |

A computer does roughly a billion simple steps per second. For a million items, the O(n log n) sort finishes in a fraction of a second, but an O(n²) one needs about 10¹² steps: over 15 minutes. An O(2ⁿ) algorithm is hopeless even for n = 100.

## Reading Big O from code

- A loop over n items: **O(n)**.
- A loop inside a loop, both over n items: **O(n²)**.
- A loop that halves (or doubles) a value until it reaches 1 (or n): **O(log n)**.
- Steps one after another: add them and keep the biggest. An O(n) loop followed by an O(n²) one is O(n²).

```java
for (int i = 0; i < n; i++) { ... }            // O(n)

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { ... }        // O(n²)
}

for (int m = n; m > 1; m /= 2) { ... }         // O(log n)
```

## Best, worst and average case

Big O usually describes the **worst case**. Linear search is O(n) because the target might be last or missing, even though it is sometimes found at the first step. Saying "linear search is O(n)" is a promise that it never does more than about n steps.

## Faster isn't always better

For small inputs, a simple O(n²) algorithm can be faster than a clever O(n log n) one, because the constants that Big O ignores are smaller. Big O tells you what happens when **n grows**. Prefer the simple solution when inputs are small, and the better complexity when they can be big.

## Summary

- Big O describes how the number of steps grows with the input size n, ignoring constants and small terms.
- From fast to slow: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).
- One loop is O(n), nested loops O(n²), a halving loop O(log n).
- Big O usually means the worst case, and it matters most when inputs are large.
