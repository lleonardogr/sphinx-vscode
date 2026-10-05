# Anagrams

Two texts are **anagrams** when one uses exactly the same letters as the other, just in a different order. `listen` and `silent` are anagrams; `aab` and `abb` are not, because the counts of `a` and `b` differ.

Uppercase and lowercase count as the same letter, and spaces are ignored, so `Dormitory` and `dirty room` are anagrams.

**Input**

Two lines, each with a text made of letters and spaces.

**Output**

`Anagrams` or `Not anagrams`.

**Things to know**

- `toLowerCase()` and `replace(" ", "")` give you clean texts to compare.
- A `char` is a number underneath, so you can loop over letters: `for (char c = 'a'; c <= 'z'; c++)`.
- Count how many times a letter appears with a loop and `charAt(i) == c`. Solve it without sorting arrays.
