# Rectangle Class

Objects bundle **data** (fields) with **behaviour** (methods). Create a class `Rectangle` that can answer questions about itself.

The class needs:

- fields `int width` and `int height`, and a constructor `Rectangle(int width, int height)`
- `int area()`: width × height
- `int perimeter()`: 2 × (width + height)
- `boolean isSquare()`: `true` when width equals height

**Input**

- Line 1: the number of rectangles `n`
- Next `n` lines: `width height`

**Output**

For each rectangle:

```
Area: 12, Perimeter: 14, Square: false
```

**Things to know**

- Methods inside a class can use the object's fields directly: `return width * height;`
- A `boolean` method can return a comparison: `return width == height;`
- Each `new Rectangle(w, h)` is a separate object with its own width and height.

> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword (only one class per file can be public).
