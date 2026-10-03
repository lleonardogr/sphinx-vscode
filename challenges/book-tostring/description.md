# Book with toString()

When you print an object, Java calls its `toString()` method. By default that prints something unhelpful like `Book@1b6d3586`. **Override** it to describe the object nicely.

Create a class `Book` with fields `title`, `author` and `year`, and override `toString()` so that printing a book shows:

```
"Clean Code" by Robert Martin (2008)
```

Print each book by passing the object itself to `println`.

**Input**

- Line 1: the number of books `n`
- Next `n` lines: `title;author;year` (separated by semicolons; titles and authors may contain spaces)

**Output**

One line per book in the format above.


> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword (only one class per file can be public).
