## Em resumo

Um **stream** roda um pipeline sobre uma coleção: uma origem (`lista.stream()`), quantas etapas intermediárias quiser, como `filter`, `map`, `sorted` e `limit`, e depois **uma operação terminal** que produz o resultado.

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

Streams de números (`mapToInt`, `mapToDouble`, `IntStream.range`) acrescentam `sum`, `average` e `max`; `average` e `max` devolvem um Optional, porque um stream vazio não tem nenhum.

**Cuidado:** nada roda até a operação terminal, e um stream só pode ser usado uma vez.

<!-- readings -->
