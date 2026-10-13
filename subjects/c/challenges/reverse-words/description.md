# Reverse Words

Reverse the order of the words of a line **in place**, with no second array: `the quick brown fox` becomes `fox brown quick the`. It is a classic interview question because the neat answer is a trick with two pointers.

Reverse the whole line, then reverse each word back:

```
the quick brown fox
xof nworb kciuq eht      reverse everything
fox brown quick the      reverse each word
```

Reversing a stretch of text is two pointers, one at each end, swapping characters and walking towards each other.

**Input**

Lines of at most 200 characters, until the end of the input. Words are separated by spaces.

**Output**

Each line with its words in reverse order. Spaces are reversed too: `a  b` (two spaces) becomes `b  a`, and leading spaces become trailing ones.

**Things to know**

- A `char *` can walk a string: `*p` is the character it points at and `p++` moves to the next one.
- Two pointers into the same string can be compared: `while (begin < end)`.
- Only one `char` array is allowed: the line itself.
