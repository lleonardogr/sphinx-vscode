# Overloaded area()

Java lets several methods share a name as long as their **parameters** are different. This is called **overloading**. Fill in the three methods called `area`:

| Call | Shape | Formula |
|------|-------|---------|
| `area(radius)` | circle | `π × r²` |
| `area(width, height)` | rectangle | `width × height` |
| `area(a, b, c)` | triangle with sides `a`, `b`, `c` | Heron's formula (below) |

The `main` method is ready: it reads shapes and calls `area` with one, two or three numbers.

**Input**

- Line 1: `t`, the number of shapes
- Then `t` lines: `circle r`, `rectangle w h` or `triangle a b c` (always valid)

**Output**

`Area of the circle: 12.57`, with two decimal places.

**Things to know**

- Java chooses which `area` to run from the **number and types of the arguments** in the call.
- `Math.PI` is π and `Math.sqrt(x)` is the square root of `x`.
- **Heron's formula**: with `s = (a + b + c) / 2`, the area is `√(s(s − a)(s − b)(s − c))`.
