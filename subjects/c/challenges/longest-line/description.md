# Longest Line

`fgets` needs a buffer, and any size you choose is a guess: a log file or a minified web page can have lines of 100,000 characters. Robust C programs read a line into memory that **grows** until the newline arrives, which is what the POSIX function `getline` does.

Write `char *read_line(void)`, which reads one line of any length into new memory and returns it (or `NULL` at the end of the input), and use it to find the longest line:

```
short
a bit longer      →   Lines: 3
mid                   Longest: 12
                      a bit longer
```

**Input**

Lines of text until the end of the input, each up to 100,000 characters. The last line may have no newline.

**Output**

`Lines: ` and the number of lines; then, if there was at least one line, `Longest: ` and its length, and the longest line itself (the first one if several tie).

**Things to know**

- Read with `getchar()` into a block from `malloc`, and double it with `realloc` when it fills, leaving room for the `'\0'`.
- `read_line` returns memory that outlives it, so the caller must `free` every line it gets.
- `fgets`, `getline` and `scanf` are not allowed, nor big fixed arrays: the point is the growing buffer.
