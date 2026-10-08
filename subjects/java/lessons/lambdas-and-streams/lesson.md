## In short

A **lambda** is a small function written as a value: `t -> t >= 50` takes `t` and answers true or false. A **stream** runs a pipeline over a collection: a source, then steps such as `filter`, `map` and `sorted`, then **one terminal operation** that gives the result.

```java
void main() {
    List<Double> totals = List.of(120.0, 35.5, 60.0, 15.0);
    double big = totals.stream()
            .filter(t -> t >= 50)
            .mapToDouble(t -> t)
            .sum();
    long small = totals.stream().filter(t -> t < 50).count();
    boolean huge = totals.stream().anyMatch(t -> t > 100);
    IO.println(big + " in big orders, " + small + " small, any huge: " + huge);
}
```

Terminal operations include `sum`, `count`, `toList()` and `collect(...)`; `Collectors.groupingBy` and `partitioningBy` build maps.

**Watch out:** a stream can be used only once, and nothing runs until the terminal operation. Start a new `.stream()` for each pipeline.

<!-- readings -->
