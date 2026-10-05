# Sort with a Comparator (Lambdas)

A **lambda** is a small function you can pass around like a value: `(a, b) -> a - b`. A very common use is telling `sort` **how** to compare two elements.

Read people as `name:age` and print them in two orders:

1. **By age**, youngest first; same age, alphabetical.
2. **By name length**, longest first; same length, alphabetical.

For `ana:19 bruno:17 carla:19 di:17`:

```
By age:
  17 bruno
  17 di
  19 ana
  19 carla
By name length:
  bruno
  carla
  ana
  di
```

**Input**

One line of `name:age` entries separated by spaces (lowercase names).

**Output**

As above, with two spaces before each entry.

**Things to know**

- `list.sort(comparator)` sorts in place. A **Comparator** returns a negative number when `a` comes first, positive when `b` comes first, and 0 when they tie.
- `Comparator.comparingInt(Person::age)` builds a comparator from a key; `.thenComparing(...)` breaks ties and `.reversed()` flips the order.
- `Person::age` is a **method reference**, a shorter way to write the lambda `p -> p.age()`.
