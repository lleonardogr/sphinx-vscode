# Primeiras ocorrências (LinkedHashSet)

Leia uma linha de palavras e remova as repetidas, mantendo cada palavra **onde ela apareceu primeiro**. Depois diga quantas palavras foram removidas.

Para `red blue red green blue red`:

```
Unique: red blue green
Removed duplicates: 3
```

**Entrada**

Uma linha de palavras separadas por um espaço. Maiúsculas importam: `Java` e `java` são palavras diferentes.

**Saída**

`Unique:` seguido das palavras e depois `Removed duplicates: k`.

**O que você precisa saber**

- Um `Set` nunca guarda o mesmo valor duas vezes. O `HashSet` guarda os valores sem ordem definida, mas o `LinkedHashSet` **lembra a ordem** em que foram adicionados.
- `String.join(" ", set)` junta qualquer coleção de Strings com espaços.
- `set.size()` é o número de palavras diferentes.
