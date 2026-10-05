# Pass or Fail (partitioningBy)

Split a class into students who **passed** (score 60 or more) and who **failed**, and compute the average, using streams and no loops.

For `ana:72 bruno:45 carla:60`:

```
Passed (2): ana, carla
Failed (1): bruno
Average: 59.0
```

**Input**

One line of `name:score` entries separated by spaces (scores 0 to 100).

**Output**

- `Passed (k): names` in input order, or `Passed (0): none`
- `Failed (k): names` in input order, or `Failed (0): none`
- `Average: x` with one decimal place

**Things to know**

- `Collectors.partitioningBy(predicate)` splits a stream into a `Map<Boolean, List<T>>` with exactly two keys, `true` and `false`, even when one list is empty.
- `Collectors.joining(", ")` joins Strings with a separator.
- `mapToInt(Student::score).average()` returns an `OptionalDouble`; `getAsDouble()` gives the value.
