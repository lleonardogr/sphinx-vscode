# Unknown Count

A program that reads "all the numbers" doesn't know in advance how many there are: 5, or 100,000. A fixed array is either too small or wastes memory, so programs grow their storage as the data arrives. It's how Java's `ArrayList` and Python's lists work inside: a block of memory that **doubles** when it fills up.

Read integers until the end of the input and print how many there are and their **median**, the middle value once sorted:

```
5 1 4 2 3   →   Count: 5
                Median: 3.0
```

With an even count, the median is the average of the two middle values: for `10 20 30 40` it is `25.0`.

**Input**

Integers between −10⁶ and 10⁶, separated by spaces and newlines, until the end of the input: from none up to 100,000 of them.

**Output**

`Count: ` and how many numbers were read; then, if there was at least one, `Median: ` with 1 decimal.

**Things to know**

- `malloc(capacity * sizeof *values)` gives a block for `capacity` ints. When it is full, `realloc(values, new_capacity * sizeof *values)` gives a bigger one, keeping the contents, maybe somewhere else.
- `qsort` sorts the numbers once they are all in.
- Free the block when you are done with `free(values)`.
- Big fixed arrays are not allowed: size the memory from the data.
