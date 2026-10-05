# Phone Book (TreeMap)

Keep a phone book that always lists names in **alphabetical order**. Read commands and answer each one:

| Command | Prints |
|---------|--------|
| `add NAME NUMBER` | `Added NAME`, or `Updated NAME` if the name was already there (the number is replaced) |
| `find NAME` | `NAME: NUMBER`, or `NAME not found` |
| `remove NAME` | `Removed NAME`, or `NAME not found` |
| `list` | one `NAME: NUMBER` line per contact, sorted by name, or `Phone book is empty` |

**Input**

- Line 1: `n`, the number of commands
- Then `n` commands. Names and numbers have no spaces.

**Output**

One answer per command (several lines for `list`).

**Things to know**

- A `TreeMap` is a map that keeps its **keys sorted**. Strings sort by character codes, so uppercase letters come before lowercase (`Zoe` before `adam`).
- `put(key, value)` returns the previous value, or `null` if the key was new. `remove(key)` works the same way.
- `get(key)` returns `null` for a missing key, and `containsKey(key)` tells you whether it exists.
