# Ranking Distance

Recommendation systems compare people's tastes by how differently they rank the same things. Ana and Bruno each ranked the same `n` movies. Count the pairs of movies they put in a **different order**: this is called the Kendall tau distance.

The movies are numbered by Ana's ranking: movie 1 is her favourite and movie `n` her least favourite. Bruno's list gives the same movies from his favourite to his least favourite. A pair is in a different order when Bruno puts the higher-numbered movie first.

Then print how much they agree: the share of all n(n − 1)/2 pairs in the same order, as a percentage with one decimal.

For Bruno's list `2 1 5 3 4`, the pairs (2, 1), (5, 3) and (5, 4) are reversed. That is 3 of the 10 pairs:

```
different pairs: 3
agreement: 70.0%
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Line 2: Bruno's ranking: the numbers 1 to `n`, each once, in his order

**Output**

- `different pairs: ` and the count.
- `agreement: ` and 100 × (pairs − different) / pairs with one decimal, then `%`. With `n = 1` there are no pairs: print `100.0%`.

**Things to know**

- These pairs are the list's **inversions**. Merge sort can count them while it sorts, in O(n log n).
- With 200,000 movies there are about 2 × 10¹⁰ pairs: use `long`.
- `String.format("%.1f%%", value)` prints one decimal and a `%`.
