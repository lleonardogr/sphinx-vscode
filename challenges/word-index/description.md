# Word Index (flatMap)

The index at the back of a book lists every word with the pages where it appears. Build one for a text, where the "pages" are line numbers, using streams and no loops.

A **word** is a run of letters, in lowercase (`The` and `the` are the same word). For

```
The cat sat.
A dog and a cat!
the END
```

the index is

```
a: 2
and: 2
cat: 1, 2
dog: 2
end: 3
sat: 1
the: 1, 3
```

**Input**

- Line 1: `n`, the number of lines (at least one has a letter)
- Then `n` lines of text (they may be empty)

**Output**

Every word in alphabetical order, with the lines where it appears (numbered from 1, in increasing order, each listed once).

**Things to know**

- `map` turns each element into **one** new element; **`flatMap`** turns each element into a **stream** of elements and joins them all, which is what you need to go from lines to words.
- A small `record Entry(String word, int line)` keeps each word together with its line number while the stream flows.
- `Collectors.groupingBy(key, TreeMap::new, Collectors.mapping(value, Collectors.toCollection(TreeSet::new)))` groups into a sorted map of sorted sets.
