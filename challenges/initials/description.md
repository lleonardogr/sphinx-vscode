# Initials

Turn a full name into its initials: the first letter of every word in **uppercase**, each followed by a dot.

`Ana Lima` becomes `A.L.` and `maria clara souza` becomes `M.C.S.`.

**Input**

One line with a name of one or more words. Words are separated by one or more spaces, and the line may start or end with spaces.

**Output**

The initials, like `A.L.`.

**Things to know**

- `trim()` removes the spaces at the start and the end of a String.
- `split(" +")` splits at every group of spaces, so `"a   b"` gives `["a", "b"]`.
- `charAt(0)` returns the first `char` of a String, and `Character.toUpperCase` makes it uppercase.
