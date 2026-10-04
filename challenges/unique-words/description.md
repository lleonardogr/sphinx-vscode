# Unique Words (HashSet)

A **`HashSet`** stores each value at most once, and checks whether it contains a value very quickly. Use one to analyse a sentence.

Words are separated by single spaces. Ignore upper/lowercase (`The` and `the` are the same word).

**Input**

One line of words.

**Output**

```
Unique words: <how many different words>
First repeat: <the first word that appears a second time>
```

If no word repeats, the second line is `No repeats`.

**Things to know**

- `Set<String> seen = new HashSet<>();`
- `seen.add(word)` returns `false` if the word was **already** in the set.
- `seen.size()` is the number of different values.
