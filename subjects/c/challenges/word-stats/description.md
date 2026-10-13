# Word Stats

Every word processor shows a word count, and every one of them has to decide what a "word" is. Here, as in most of them, a word is a run of characters without spaces, so `C   is fun` has 3 words however many spaces separate them.

Read one line and print its length, its number of words and its longest word:

```
the quick brown fox   →   Characters: 19
                          Words: 4
                          Longest: quick
```

**Input**

One line of text, at most 200 characters, with words separated by one or more spaces (and maybe spaces at the start or end).

**Output**

- `Characters: ` and the length of the line, spaces included, without the newline;
- `Words: ` and the number of words;
- `Longest: ` and the longest word (the first one if several tie), or `-` when there are no words.

**Things to know**

- `fgets(line, sizeof line, stdin)` reads the whole line, spaces included, and keeps the newline: cut it with `line[strcspn(line, "\n")] = '\0';`. The last line of the input may have no newline.
- A string ends at `'\0'`: loop while `line[i] != '\0'`.
- `printf("%.*s", n, &line[i])` prints `n` characters starting at index `i`.
