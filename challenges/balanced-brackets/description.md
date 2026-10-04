# Balanced Brackets (Stack)

A **stack** is "last in, first out", like a pile of plates: you can only take the plate on top. Stacks are perfect for checking brackets.

A text is **balanced** when every `(`, `[` and `{` is closed by the matching `)`, `]` or `}`, in the right order. Other characters are ignored.

| Text | Result |
|------|--------|
| `([]{})` | Balanced |
| `([)]` | Not balanced (closed in the wrong order) |
| `((` | Not balanced (never closed) |

**Input**

One line of text.

**Output**

`Balanced` or `Not balanced`.

**Things to know**

- `Deque<Character> stack = new ArrayDeque<>();`
- `stack.push(c)` puts on top, `stack.pop()` removes and returns the top, `stack.isEmpty()`.
