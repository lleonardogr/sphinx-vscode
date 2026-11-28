## Em resumo

Um **Map** liga cada **chave** a um valor, como um dicionário liga uma palavra ao significado. Cada chave aparece uma vez: pô-la de novo troca o valor.

```java
void main() {
    Map<String, Integer> votes = new HashMap<>();
    for (String v : List.of("vermelho", "azul", "vermelho", "verde", "vermelho")) {
        votes.merge(v, 1, Integer::sum);       // soma 1, começando em 1
    }
    IO.println(votes.get("vermelho"));          // 3
    IO.println(votes.getOrDefault("rosa", 0));  // 0: chave inexistente

    Map<String, Integer> sorted = new TreeMap<>(votes);
    for (Map.Entry<String, Integer> e : sorted.entrySet()) {
        IO.println(e.getKey() + ": " + e.getValue());
    }
}
```

`HashMap` não tem ordem útil de chaves, `LinkedHashMap` mantém a ordem de inserção, `TreeMap` mantém as chaves ordenadas, e `EnumMap` segue a ordem de um enum.

**Cuidado:** `get` devolve `null` para uma chave inexistente, e usar esse `null` como número quebra. Prefira `getOrDefault`.

<!-- readings -->
