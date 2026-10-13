# CSV Fields

Spreadsheets export **CSV**, comma-separated values: one line per row, commas between the fields. A field that contains a comma is put between double quotes, and a quote inside such a field is written twice. Splitting at every comma breaks on the first name like `"Lovelace, Ada"`, which is why real programs read CSV character by character.

Read CSV lines and print the fields of each:

```
"Lovelace, Ada",1815,"said ""hi"""   →   3 | [Lovelace, Ada] [1815] [said "hi"]
a,,b                                 →   3 | [a] [] [b]
```

**Input**

Lines of CSV, each at most 200 characters, until the end of the input. Quotes are always well formed: a quoted field starts with `"` right after a comma (or at the start of the line) and its closing `"` is followed by a comma or the end of the line.

**Output**

For each line, the number of fields, ` |`, and each field between `[` and `]`, preceded by a space.

**Things to know**

- An empty line is one empty field, and `a,` has two fields, the second empty.
- Spaces belong to the field: ` x ` stays ` x `.
- `strtok` is not allowed: it skips empty fields and knows nothing about quotes.
