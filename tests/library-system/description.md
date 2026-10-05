# Library System

Build the console system of a small library, with **classes** for the books and the library itself. This test combines **collections**, **methods** and **object-oriented design** in one program.

**What your program does**

Read commands, one per line, until `exit`:

| Command | Prints |
|---------|--------|
| `add ID TITLE` | `Added book ID: TITLE`, or `Book ID already exists`. The title can have spaces. |
| `join NAME` | `Member NAME joined`, or `Member NAME already exists` |
| `borrow ID NAME` | `NAME borrowed TITLE` (see the checks below) |
| `return ID` | `TITLE returned`, or `No book ID`, or `TITLE is not borrowed` |
| `list` | one line per book, sorted by ID: `ID TITLE - available` or `ID TITLE - borrowed by NAME`; or `No books` |
| `exit` | `Books: n, borrowed: m`, then `Goodbye!`, and the program ends |
| anything else | `Unknown command` |

For `borrow`, check in this order: `No book ID`, `No member NAME`, `TITLE is already borrowed by OTHER`, and `NAME has reached the limit of 2 books` (a member can hold at most 2 books at a time).

IDs and names are single words; IDs are sorted alphabetically (`B10` comes before `B2`).

**Example**

Input:

```
add B1 Dom Casmurro
add B2 The Hobbit
join ana
borrow B1 ana
borrow B1 bia
join bia
borrow B1 bia
list
return B1
borrow B1 bia
exit
```

Output:

```
Added book B1: Dom Casmurro
Added book B2: The Hobbit
Member ana joined
ana borrowed Dom Casmurro
No member bia
Member bia joined
Dom Casmurro is already borrowed by ana
B1 Dom Casmurro - borrowed by ana
B2 The Hobbit - available
Dom Casmurro returned
bia borrowed Dom Casmurro
Books: 2, borrowed: 1
Goodbye!
```

**Things to know**

- A `Book` object can remember its borrower in a field; `null` means "available".
- Keeping the rules inside `Library` methods (which return the message) keeps `main` short and each rule in one place.
- `TreeMap` keeps the books sorted by ID, so `list` just walks through it.
- `line.split(" ", 3)` splits into at most 3 parts, so the title keeps its spaces.
