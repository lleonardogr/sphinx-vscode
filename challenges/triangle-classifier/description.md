# Triangle Classifier

Read the lengths of three sides and say what kind of triangle they make:

| Sides | Print |
|-------|-------|
| not a triangle (see below) | `Not a triangle` |
| all three equal | `Equilateral` |
| exactly two equal | `Isosceles` |
| all different | `Scalene` |

Three lengths make a triangle only when **every side is greater than 0** and **each side is smaller than the sum of the other two**. So `1 2 3` is not a triangle (the sides lie flat), but `3 4 5` is.

**Input**

One line with three integers `a b c`.

**Output**

One of `Not a triangle`, `Equilateral`, `Isosceles` or `Scalene`.

**Things to know**

- Check for "not a triangle" first, so the other checks only see real triangles.
- `&&` (and) and `||` (or) combine conditions: `a < b + c && b < a + c && c < a + b`.
- Equilateral triangles also have two equal sides, so test for three equal sides before two.
