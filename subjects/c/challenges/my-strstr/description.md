# Find Every Match

Every editor's "Find" does the same thing: look for a word inside a text. The C library's `strstr` returns a **pointer** to where the word starts inside the text, or `NULL` when it isn't there. Write your own, then use it to find every match on each line.

```
word: cat
the cat sat on the cat mat   →   1: 4 19
dog                          →   2: none
```

Matches may overlap: in `aaaa`, `aa` is found at 0, 1 and 2.

**Input**

- Line 1: the word to find (1 to 50 characters, maybe with spaces)
- Then lines of text (at most 200 characters each), until the end of the input

**Output**

For each line of text, its number (from 1), `:`, and the position of every match (from 0), each after a space, or ` none`.

**Things to know**

- Write `const char *find(const char *text, const char *word)` (or with `char *`), returning a pointer into `text` or `NULL`.
- The position of a match is `p - line`: subtracting two pointers into the same array gives the distance between them. Print it with `%td`.
- To find the next match, search again starting at `p + 1`.
- The search is case-sensitive, and `strstr`, `strncmp` and friends are not allowed.
