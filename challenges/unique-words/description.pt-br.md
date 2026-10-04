# Palavras únicas (HashSet)

Um **`HashSet`** guarda cada valor no máximo uma vez e verifica muito rápido se contém um valor. Use um para analisar uma frase.

As palavras são separadas por um espaço. Ignore maiúsculas e minúsculas (`The` e `the` são a mesma palavra).

**Entrada**

Uma linha de palavras.

**Saída**

```
Unique words: <quantas palavras diferentes>
First repeat: <a primeira palavra que aparece pela segunda vez>
```

Se nenhuma palavra se repete, a segunda linha é `No repeats`.

**O que você precisa saber**

- `Set<String> seen = new HashSet<>();`
- `seen.add(word)` retorna `false` se a palavra **já** estava no conjunto.
- `seen.size()` é o número de valores diferentes.
