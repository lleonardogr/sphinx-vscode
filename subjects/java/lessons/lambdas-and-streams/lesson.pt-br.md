## Em resumo

Uma **lambda** é uma pequena função escrita como valor: `t -> t >= 50` recebe `t` e responde verdadeiro ou falso. Um **stream** roda um pipeline sobre uma coleção: uma origem, depois passos como `filter`, `map` e `sorted`, depois **uma operação terminal** que dá o resultado.

```java
void main() {
    List<Double> totals = List.of(120.0, 35.5, 60.0, 15.0);
    double big = totals.stream()
            .filter(t -> t >= 50)
            .mapToDouble(t -> t)
            .sum();
    long small = totals.stream().filter(t -> t < 50).count();
    boolean huge = totals.stream().anyMatch(t -> t > 100);
    IO.println(big + " em pedidos grandes, " + small + " pequenos, algum enorme: " + huge);
}
```

As operações terminais incluem `sum`, `count`, `toList()` e `collect(...)`; `Collectors.groupingBy` e `partitioningBy` montam mapas.

**Cuidado:** um stream só pode ser usado uma vez, e nada roda até a operação terminal. Comece um novo `.stream()` para cada pipeline.

<!-- readings -->
