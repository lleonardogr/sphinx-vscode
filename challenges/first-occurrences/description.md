# First Occurrences (LinkedHashSet)

Read a line of words and remove the repeated ones, keeping each word **where it first appeared**. Then say how many words were removed.

For `red blue red green blue red`:

```
Unique: red blue green
Removed duplicates: 3
```

**Input**

One line of words separated by single spaces. Case matters: `Java` and `java` are different words.

**Output**

`Unique:` followed by the words, then `Removed duplicates: k`.

**Things to know**

- A `Set` never holds the same value twice. A `HashSet` stores values in no particular order, but a `LinkedHashSet` **remembers the order** they were added.
- `String.join(" ", set)` joins any collection of Strings with spaces.
- `set.size()` is the number of different words.
