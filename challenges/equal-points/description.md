# Equal Points (equals and hashCode)

`HashSet` and `HashMap` decide whether two objects are "the same" with `equals` and `hashCode`. The class `Point` doesn't override them yet, so two points with the same coordinates count as **different**, and the program below gives wrong answers.

Override both methods so that points with the same `x` and `y` are equal. The `main` method is ready; for the points `(1, 2) (3, 4) (1, 2) (0, 0) (1, 2)` it should print:

```
Points read: 5
Unique points: 3
Most repeated: (1, 2) x3
Contains (0, 0): true
```

**Input**

- Line 1: `n` (1 to 1000)
- Then `n` lines with two integers `x y`

**Things to know**

- By default, `equals` checks whether two variables point to the **same object**, not whether the objects hold the same values.
- `equals` must take an `Object`: `public boolean equals(Object o)`. With `int` or `Point` as the parameter type you would be **overloading** it, and `HashSet` would never call it.
- **Equal objects must have equal hash codes.** If you override `equals` without `hashCode`, a `HashSet` looks in the wrong place and still sees duplicates. `Objects.hash(x, y)` builds a good hash code.
