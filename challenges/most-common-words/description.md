# Most Common Words

Find the `k` words that appear most often in a text. A **word** is a run of letters: everything else (spaces, punctuation, digits, apostrophes) separates words. Uppercase and lowercase count as the same word, and words are printed in lowercase.

Sort by **count, highest first**. Words with the same count go in **alphabetical order**.

For `k = 2` and `The cat and the hat. The END, and the cat!`:

```
the: 4
and: 2
```

(`and` and `cat` both appear twice; `and` comes first alphabetically.)

**Input**

- Line 1: `k` (1 ≤ k ≤ 100)
- Line 2: the text, with at least one letter

**Output**

`word: count` for the top `k` words, or for every word if there are fewer than `k`.

**Things to know**

- `text.toLowerCase().split("[^a-z]+")` splits at anything that isn't a letter. The first piece can be empty if the text starts with punctuation.
- `map.merge(word, 1, Integer::sum)` counts in one line.
- A map has no order, so copy `map.entrySet()` into a `List` and sort it with `Comparator`: `Map.Entry.<String, Integer>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey())`.
