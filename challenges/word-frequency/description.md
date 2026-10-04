# Word Frequency (HashMap)

A **map** connects keys to values, like a dictionary connects words to definitions. Use one to count how many times each word appears.

Words are separated by single spaces. Ignore upper/lowercase.

**Input**

One line of words.

**Output**

Each different word with its count, in **alphabetical order**, one per line:

```
and: 1
cat: 1
the: 2
```

**Things to know**

- `Map<String, Integer> counts = new HashMap<>();`
- `counts.getOrDefault(word, 0)` returns the current count, or `0` the first time.
- `counts.put(word, value)` stores a count.
- A `HashMap` has no order. To print alphabetically, use a `TreeMap` (which keeps its keys sorted) or sort the keys.
