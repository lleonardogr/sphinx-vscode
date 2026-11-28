## In short

A **stream** runs a pipeline over a collection: a source (`list.stream()`), any number of intermediate steps such as `filter`, `map`, `sorted` and `limit`, then **one terminal operation** that produces the result.

```java
void main() {
    List<Double> orders = List.of(120.0, 35.5, 60.0, 15.0, 80.0);
    List<Double> top = orders.stream()
            .filter(t -> t >= 50)
            .sorted(Comparator.reverseOrder())
            .limit(2)
            .toList();
    IO.println(top);                                   // [120.0, 80.0]
    double total = orders.stream().mapToDouble(t -> t).sum();
    OptionalDouble avg = orders.stream().mapToDouble(t -> t).average();
    IO.println(total + " " + avg.orElse(0));
    IO.println(IntStream.rangeClosed(1, 5).map(n -> n * n).sum());   // 55
}
```

Number streams (`mapToInt`, `mapToDouble`, `IntStream.range`) add `sum`, `average` and `max`; `average` and `max` give an Optional, because an empty stream has none.

**Watch out:** nothing runs until the terminal operation, and a stream can be used only once.

<!-- readings -->
