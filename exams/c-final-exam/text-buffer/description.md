# Text Buffer

Every text editor keeps the document in a **buffer** that grows as you type and closes up when you delete. Write one: a block of memory from `malloc` that grows with `realloc`, and commands that insert and delete anywhere.

```
append Hello
append World
insert 5 -
print             [Hello-World] (11)
delete 0 6
print             [World] (5)
```

The text starts right after the single space that follows the command (or the position), and is used exactly as it is: `append  x` with two spaces adds ` x`.

**Input**

Commands until the end of the input, one per line (at most 200 characters):

- `append TEXT`: adds `TEXT` (maybe empty, maybe with spaces) at the end;
- `insert POS TEXT`: inserts `TEXT` before position `POS` (0 is the start, the length is the end);
- `delete POS COUNT`: removes `COUNT` characters starting at `POS`;
- `print`: shows the text.

The text can grow past 100,000 characters.

**Output**

- `print`: the text between `[` and `]`, a space, and its length in brackets: `[Hello-World] (11)`.
- `insert` or `delete` with a position outside the text: `Error: position out of range`, and the text doesn't change.

**Things to know**

- `memmove(destination, source, n)` copies bytes even when the two regions overlap, which is what opening or closing a gap needs.
- Keep the length yourself instead of calling `strlen` on a long text every time.
- Free the buffer at the end.
