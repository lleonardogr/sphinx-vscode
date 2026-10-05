# Ask Until Valid

A form asks for the user's age and keeps asking until the answer is valid. An age must be a whole number from `0` to `120`.

Complete `parseAge`: it converts the text and **throws an `IllegalArgumentException`** when the age is out of range. Then keep reading lines in `main` until one is valid:

```
Not a number: twenty
Out of range: 130
Age accepted: 25
```

**Input**

One answer per line. There is always a valid answer eventually; ignore any lines after it. Spaces around an answer are allowed.

**Output**

- `Not a number: text` when the line isn't a whole number (show the text without the spaces around it)
- `Out of range: age` when it is a number outside 0 to 120
- `Age accepted: age` for the first valid answer, and then stop

**Things to know**

- `throw new IllegalArgumentException("message")` signals a problem; the caller's `catch` receives it, and `e.getMessage()` returns the message.
- A `try` can have several `catch` blocks. Java uses the **first one that matches**, and `NumberFormatException` is a kind of `IllegalArgumentException`, so catch it first.
- A `while (true)` loop with `break` once the age is accepted keeps asking as long as needed.
