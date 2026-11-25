# Autocomplete

When you type "car" in a search box, it suggests *card*, *care* and *cart* before you finish. To do that quickly, the words are stored in a **trie**: a tree of letters where every path from the root spells a prefix.

Read the words people have typed, then answer prefix questions: how many of the words start with each prefix?

For the words `car card care cart dog dot do car`:

```
car → 5
ca → 5
do → 3
d → 3
x → 0
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000), then `n` words, one per line (1 to 10 lowercase letters; a word can repeat, and each time counts)
- Then `q` (1 ≤ q ≤ 20,000), then `q` prefixes, one per line (1 to 10 lowercase letters)

**Output**

One line per prefix: how many words start with it. A word counts as starting with itself.

**Things to know**

- `word.startsWith(prefix)` for every word and every prefix is 4 × 10⁹ checks on the biggest test.
- A trie node can be an array of 26 children plus a counter; `c - 'a'` turns a letter into its index.
- Sorting the words and binary-searching where a prefix's words begin and end is also fast.
