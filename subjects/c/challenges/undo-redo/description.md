# Undo and Redo

Every editor has **undo** and **redo**. The history is a list you can walk both ways, which in C is a **doubly linked list**: each node points to the next one and back to the previous one. A pointer marks where you are; undo and redo just move it. Typing something new after an undo throws away the steps you could have redone.

The editor here types whole words. Process the commands:

```
type Hello
type big
type world
undo
show        Hello big
redo
show        Hello big world
```

**Input**

Commands until the end of the input, one per line: `type WORD` (1 to 30 characters, no spaces), `undo`, `redo` or `show`.

**Output**

- `show` prints the document, its words separated by single spaces, or `(empty)`;
- `undo` with nothing to undo prints `nothing to undo`, and `redo` with nothing to redo prints `nothing to redo`;
- other commands print nothing.

**Things to know**

- One node per typed word, with `prev` and `next`, and a pointer to the last word in the document (`NULL`, or a sentinel node, for an empty document).
- `undo` moves the pointer back, `redo` forward. The words after the pointer stay in the list until something new is typed.
- `type` after an `undo` must free the nodes after the pointer before adding the new word.
