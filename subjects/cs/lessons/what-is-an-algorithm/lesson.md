## Why it matters

Every program you write follows a plan: read the input, do some steps, print the answer. That plan is an **algorithm**. Two programs can give the same answer while one takes a second and the other a day, and the difference is almost always the algorithm, not the computer.

## Algorithms are precise recipes

An algorithm is a **finite list of precise steps** that solves a problem. A recipe is close: "beat 3 eggs, add 200 g of flour, bake for 30 minutes". To count as an algorithm, it must:

- be **precise**: each step has exactly one meaning, so a computer can follow it;
- **finish**: it can't run forever;
- be **correct**: it gives the right answer for every valid input, not just the examples.

The same problem usually has many algorithms, and some are much faster than others.

## Example: finding a number in a list

Suppose you need to know whether 37 is in a list of 1,000 numbers.

**Linear search** looks at the numbers one by one, from the first. If 37 is near the start it is quick, but if it is last, or not there at all, it looks at all 1,000 numbers.

**Binary search** needs the list to be **sorted**, but then it is much faster. Look at the number in the middle:

1. If it is 37, you're done.
2. If it is bigger than 37, 37 can only be in the first half: throw the second half away.
3. If it is smaller, throw the first half away.
4. Repeat with the half that is left.

Every step halves what's left: 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1. So binary search needs **at most 10 steps** for 1,000 numbers, and only 20 for a million. It is the "guess the number" game played well: to guess a number from 1 to 100, always guess the middle, and you never need more than 7 guesses.

| Numbers in the list | Linear search (worst case) | Binary search (worst case) |
|---------------------|----------------------------|----------------------------|
| 10 | 10 | 4 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |

## Example: sorting

Sorting is so common that dozens of algorithms exist. **Selection sort** is simple: find the smallest number and swap it to the front; then find the smallest of the rest and swap it into second place; and so on. Each pass looks at all the remaining numbers, so a list of n numbers needs about n²/2 comparisons. Faster algorithms such as merge sort, and the one inside Java's `Arrays.sort`, need only about n × log₂ n.

For 1,000 numbers, that is about 500,000 comparisons against about 10,000.

## How to think about an algorithm

1. **Understand the problem**: what is the input, what is the output, what are the edge cases (empty list, one element, not found)?
2. **Find a simple correct solution** first, even if it is slow.
3. **Count the work** it does as the input grows.
4. **Look for a better idea** when the input can be large: sorting first, halving, or remembering results you already computed.

## Summary

- An algorithm is a finite list of precise steps that correctly solves a problem.
- Linear search checks every element; binary search halves a sorted list at each step.
- Selection sort needs about n²/2 comparisons; good sorting algorithms need about n log₂ n.
- Start with a simple correct solution, then count its work and improve it.
