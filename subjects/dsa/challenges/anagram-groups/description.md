# Anagram Groups

Word games, spelling checkers and plagiarism detectors group words that use the same letters: **anagrams**, like *listen*, *silent* and *enlist*. Read a list of words and group them.

The trick is the **key**: give every word a key that is the same for all its anagrams and different for everything else, then count the words per key in a hash map.

For `listen silent enlist google tinsel banana` there are three groups: {listen, silent, enlist, tinsel}, {google} and {banana}.

```
groups: 3
largest group: 4
alone: 2
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 200,000)
- Then `n` words, one per line: 1 to 10 lowercase letters. The same word can appear more than once, and each time counts.

**Output**

`groups: ` and the number of groups, `largest group: ` and the size of the biggest one, and `alone: ` and how many groups have a single word.

**Things to know**

- Sorting a word's letters gives a good key: `char[] c = word.toCharArray(); Arrays.sort(c); String key = new String(c);`
- `counts.merge(key, 1, Integer::sum)` counts words per key.
- Comparing every word with every other is O(n²): far too slow for 200,000 words.
