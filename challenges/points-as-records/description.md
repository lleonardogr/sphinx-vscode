# Points as Records

A **record** is a short way to write a class that just holds data. This one line:

```java
record Point(int x, int y) {}
```

gives you a constructor, the accessors `x()` and `y()`, and ready-made `toString`, `equals` and `hashCode`. Add two methods to the record:

- `double distanceTo(Point other)`: the straight-line distance between the two points
- `Point translate(int dx, int dy)`: a **new** point moved by `dx` and `dy`

The `main` method is ready. For points `(1, 2)` and `(4, 6)` moved by `3 4` it prints:

```
A = Point[x=1, y=2]
B = Point[x=4, y=6]
Distance: 5.00
A moved = Point[x=4, y=6]
A moved equals B: true
```

**Input**

- Line 1: `x1 y1 x2 y2`
- Line 2: `dx dy`

**Things to know**

- Records are **immutable**: their fields can't change, so methods like `translate` return a new record.
- The distance between two points is `√(dx² + dy²)`.
- A record's `equals` compares the components, so two points with the same `x` and `y` are equal.
