# Agrupar palavras por tamanho

`Collectors.groupingBy` divide um stream em grupos, como o `GROUP BY` do SQL. Agrupe palavras pelo tamanho.

**Resolva sem laços `for` ou `while`.**

**Entrada**

Uma linha de palavras separadas por um espaço.

**Saída**

Uma linha por tamanho, **do menor para o maior**. Cada linha tem o tamanho, `: ` e as palavras desse tamanho na ordem original, separadas por `, `. Por exemplo:

```
1: a
3: cat, dog
5: house, mouse
```

**O que você precisa saber**

- `Collectors.groupingBy(String::length)` devolve um `Map<Integer, List<String>>`.
- A forma com 3 argumentos deixa você escolher o mapa e o que juntar em cada grupo: `groupingBy(String::length, TreeMap::new, Collectors.joining(", "))`. Um `TreeMap` mantém as chaves ordenadas.
- `map.forEach((chave, valor) -> ...)` executa um código para cada entrada, sem laço.
