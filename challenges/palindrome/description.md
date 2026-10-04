# Palindrome Check

A **palindrome** is a word that reads the same forwards and backwards, like `level`, `noon` or `Racecar`. Read a word and check whether it is one. Ignore uppercase and lowercase differences: `Racecar` counts, because `racecar` reversed is still `racecar`.

**Input**

A single word.

**Output**

`Palindrome` or `Not a palindrome`.

**Things to know**

- `word.toLowerCase()` removes case differences before comparing.
- Compare the first and last characters, then the second and second-to-last, and so on: `word.charAt(i)` with `word.charAt(word.length() - 1 - i)`. You only need to go halfway.
- Compare Strings with `equals`, never `==`: `a.equals(b)`.
- A one-letter word is a palindrome.
