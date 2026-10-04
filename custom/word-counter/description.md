# Word Counter

Read a line of text and print how many **words** it has. A word is any group of characters without spaces. Spaces can appear more than once, and at the start or end of the line.

**Input**

One line of text (it may be empty).

**Output**

The number of words.

**Things to know**

- `text.trim()` removes spaces at the start and end.
- `text.split("\\s+")` splits on one or more spaces and returns an array.
