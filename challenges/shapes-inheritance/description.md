# Shapes (Inheritance)

With **inheritance**, several classes share a common parent. The `abstract` class `Shape` says that every shape has a `name()` and an `area()`, but leaves each subclass to decide how to calculate them.

`Shape` and an example subclass, `Circle`, are already written. Add:

- `class Square extends Shape`: built from one side, area = side × side
- `class Triangle extends Shape`: built from base and height, area = base × height / 2

Then finish `main`. Because every object is a `Shape`, the same line of code can print any of them. This is called **polymorphism**.

**Input**

- Line 1: the number of shapes `n`
- Next `n` lines: `circle <radius>`, `square <side>` or `triangle <base> <height>`

**Output**

One line per shape with its area (2 decimals), then the total of the exact areas:

```
Circle: 12.57
Square: 9.00
Total area: 21.57
```


> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword (only one class per file can be public).
