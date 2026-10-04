# Group Words by Length

`Collectors.groupingBy` splits a stream into groups, like `GROUP BY` in SQL. Group words by their length.

**Solve it without `for` or `while` loops.**

**Input**

One line of words separated by single spaces.

**Output**

One line per length, **shortest first**. Each line has the length, `: `, and the words of that length in their original order, separated by `, `. For example:

```
1: a
3: cat, dog
5: house, mouse
```

**Things to know**

- `Collectors.groupingBy(String::length)` returns a `Map<Integer, List<String>>`.
- The 3-argument form lets you choose the map and what to collect in each group: `groupingBy(String::length, TreeMap::new, Collectors.joining(", "))`. A `TreeMap` keeps the keys sorted.
- `map.forEach((key, value) -> ...)` runs some code for each entry, without a loop.
