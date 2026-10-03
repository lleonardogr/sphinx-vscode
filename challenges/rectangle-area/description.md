# Rectangle Area and Perimeter

Read the **width** and **height** of a rectangle (they can have decimals) and print its area and perimeter with **exactly two decimal places**.

**Input**

One line with two decimal numbers: `width height`.

**Output**

```
Area: <width * height>
Perimeter: <2 * (width + height)>
```

**Things to know**

- Use `double` for numbers with decimals, and `scanner.nextDouble()` to read them.
- `IO.println("Area: %.2f".formatted(area));` prints a number with two decimals. (Classic Java: `System.out.printf("Area: %.2f%n", area);`)
