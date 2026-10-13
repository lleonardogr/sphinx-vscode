# Label Printer

A label printer prints names in a fixed-width box. Names that are too long must be cut, and in C cutting text is where programs break: copy a 100-character name into a 30-character array and you write past its end. `printf` precision and `snprintf` cut text **safely**.

Read a width and some names and print them in a box:

```
width 10:   +----------+
            |Ada Lov...|
            |Grace     |
            |Alan Tu...|
            +----------+
```

**Input**

- Line 1: the width (5 to 40)
- Then one name per line, until the end of the input (0 or more names, each 1 to 100 characters, maybe with spaces)

**Output**

A border of `+`, `width` dashes and `+`; one line per name between `|` and `|`, padded with spaces to the width; and the border again. A name longer than the width shows its first `width − 3` characters followed by `...`.

**Things to know**

- `printf("|%-*s|", width, name)` pads to the width; `%.*s` prints at most that many characters. The `*` takes its number from the arguments.
- `snprintf(buffer, size, "%s", name)` copies at most `size − 1` characters and always adds `'\0'`.
- Read each name with `fgets` into an array big enough for 100 characters plus the newline and `'\0'`, or a long name arrives in two pieces.
