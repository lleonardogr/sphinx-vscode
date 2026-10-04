# Frequência de palavras (HashMap)

Um **mapa** liga chaves a valores, como um dicionário liga palavras a definições. Use um para contar quantas vezes cada palavra aparece.

As palavras são separadas por um espaço. Ignore maiúsculas e minúsculas.

**Entrada**

Uma linha de palavras.

**Saída**

Cada palavra diferente com a sua contagem, em **ordem alfabética**, uma por linha:

```
and: 1
cat: 1
the: 2
```

**O que você precisa saber**

- `Map<String, Integer> counts = new HashMap<>();`
- `counts.getOrDefault(word, 0)` devolve a contagem atual, ou `0` na primeira vez.
- `counts.put(word, valor)` guarda uma contagem.
- Um `HashMap` não tem ordem. Para imprimir em ordem alfabética, use um `TreeMap` (que mantém as chaves ordenadas) ou ordene as chaves.
