## Em resumo

`collect(...)` é a operação terminal que monta um recipiente a partir de um stream, e a classe **Collectors** faz os mais comuns: `joining`, `toSet`, `toMap`, `groupingBy` e `partitioningBy`.

```java
void main() {
    List<String> cities = List.of("Lima", "Lisboa", "Paris", "Porto", "Roma");
    IO.println(cities.stream().collect(Collectors.joining(", ")));
    Map<Character, List<String>> byLetter = cities.stream()
            .collect(Collectors.groupingBy(c -> c.charAt(0)));
    IO.println(byLetter);          // {P=[Paris, Porto], R=[Roma], L=[Lima, Lisboa]}
    Map<Boolean, Long> short4 = cities.stream()
            .collect(Collectors.partitioningBy(c -> c.length() <= 4, Collectors.counting()));
    IO.println(short4);            // {false=3, true=2}

    List<List<Integer>> rows = List.of(List.of(1, 2), List.of(3));
    IO.println(rows.stream().flatMap(List::stream).toList());   // [1, 2, 3]
}
```

O `groupingBy` dá um map de cada chave para os itens dela; um segundo collector, como `counting()`, transforma cada grupo em outra coisa.

**Cuidado:** o `toMap` lança uma exceção quando dois itens têm a mesma chave, a não ser que você diga como juntá-los.

<!-- readings -->
