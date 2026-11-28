## In short

`collect(...)` is the terminal operation that builds a container from a stream, and the **Collectors** class makes the common ones: `joining`, `toSet`, `toMap`, `groupingBy` and `partitioningBy`.

```java
void main() {
    List<String> cities = List.of("Lima", "Lisbon", "Paris", "Porto", "Rome");
    IO.println(cities.stream().collect(Collectors.joining(", ")));
    Map<Character, List<String>> byLetter = cities.stream()
            .collect(Collectors.groupingBy(c -> c.charAt(0)));
    IO.println(byLetter);          // {P=[Paris, Porto], R=[Rome], L=[Lima, Lisbon]}
    Map<Boolean, Long> short4 = cities.stream()
            .collect(Collectors.partitioningBy(c -> c.length() <= 4, Collectors.counting()));
    IO.println(short4);            // {false=3, true=2}

    List<List<Integer>> rows = List.of(List.of(1, 2), List.of(3));
    IO.println(rows.stream().flatMap(List::stream).toList());   // [1, 2, 3]
}
```

`groupingBy` gives a map from each key to its items; a second collector, such as `counting()`, turns each group into something else.

**Watch out:** `toMap` throws an exception when two items have the same key, unless you say how to merge them.

<!-- readings -->
