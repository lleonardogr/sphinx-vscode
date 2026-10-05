# Word Stats

Read a line of text and report on its words:

```
Words: 5
Longest: quick
Vowels: 6
```

That is the output for `The quick brown fox jumps`. `quick`, `brown` and `jumps` all have 5 letters; when there is a tie, the **first** one wins.

**Input**

One line with at least one word. Words are made of letters and are separated by one or more spaces. The line may start or end with spaces.

**Output**

- `Words: n`, the number of words
- `Longest: w`, the longest word, as written in the input
- `Vowels: v`, how many of the letters are `a`, `e`, `i`, `o` or `u`, in uppercase or lowercase

**Things to know**

- `trim()` removes the spaces around the line, and `split(" +")` splits at every group of spaces.
- Compare lengths with `length()`. Use `>` (not `>=`) so the first longest word is kept.
- `"aeiou".indexOf(c) >= 0` checks whether a lowercase `char` is a vowel.
