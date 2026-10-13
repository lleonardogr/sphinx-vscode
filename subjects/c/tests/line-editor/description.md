# Line Editor

**Test: units 4 to 9.** This program mixes strings, pointers, dynamic memory, structs and linked lists.

Before full-screen editors, programmers edited files one line at a time with **line editors** such as `ed`. Write a small one. The text is a list of lines, one of them **current**, and commands work on the current line. Lines can be inserted and deleted anywhere, and any line can grow, so each line is a node in a **doubly linked list**, with its text in memory from `malloc`.

```
append Dear team,
append the release is on Friday.
append Thanks!
up
insert                        (an empty line, before "the release…")
print                           1  Dear team,
                                2>
                                3  the release is on Friday.
                                4  Thanks!
replace Friday Monday         Replaced 0
down
replace Friday Monday         Replaced 1
print                           1  Dear team,
                                2
                                3> the release is on Monday.
                                4  Thanks!
```

**Input**

Commands until the end of the input, one per line (at most 200 characters):

- `append TEXT`: a new line with `TEXT` (maybe empty) after the current line; it becomes current.
- `insert TEXT`: the same, before the current line.
- `delete`: removes the current line; the next line becomes current, or the previous one if there is no next.
- `up`, `down`: move to the previous or next line.
- `replace OLD NEW`: replaces every occurrence of the word `OLD` in the current line with `NEW` (both without spaces), from left to right, without overlaps.
- `print`: shows the whole text.

When the buffer is empty, `append` and `insert` create the first line.

**Output**

- `print`: each line as `printf("%3d%c %s\n", number, mark, text)`, where the mark is `>` for the current line and a space otherwise; or `(empty)`.
- `replace`: `Replaced N`.
- `up` at the first line: `Error: at top`; `down` at the last: `Error: at bottom`.
- `delete`, `up`, `down` or `replace` on an empty buffer: `Error: empty buffer`.

**Things to know**

- A line can get longer with `replace`: allocate a new string of the right size, fill it, and free the old one.
- `strstr(text, word)` finds the next occurrence; continue searching after it.
- Free every line's text and node when the program ends.
