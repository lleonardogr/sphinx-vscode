# Point in Polygon

Is this delivery address inside the delivery zone? Did the player click inside the country on the map? Maps, games and CAD tools ask whether a **point is inside a polygon** all the time. Points and polygons are natural structs: a `Point` has `x` and `y`, a `Polygon` has its corners.

Read a polygon, print its area and perimeter, then say for each query point whether it is inside:

```
L-shaped polygon (0,0) (6,0) (6,2) (2,2) (2,5) (0,5)

Area: 18.00
Perimeter: 22.00
(1, 1) inside
(4, 1) inside
(4, 4) outside
(1, 4) inside
```

**Input**

- Line 1: `n`, the number of corners (3 ≤ n ≤ 100); then `n` lines with the corners' integer coordinates (−1000 to 1000), in order around the polygon, which doesn't cross itself
- Then `q` (1 ≤ q ≤ 100) and `q` points with integer coordinates. No query point lies exactly on an edge.

**Output**

`Area: ` and `Perimeter: ` with 2 decimals, then each point as `(x, y)` followed by `inside` or `outside`.

**Things to know**

- **Shoelace formula:** the area is half the absolute value of the sum of `x₁·y₂ − x₂·y₁` over every edge from (x₁, y₁) to (x₂, y₂), including the edge back to the first corner.
- **Ray casting:** from the point, imagine a ray going right. It crosses the polygon's edges an odd number of times exactly when the point is inside.
- `hypot(dx, dy)` from `<math.h>` is the length of an edge. Print coordinates with `%g`, which leaves out `.0`.
