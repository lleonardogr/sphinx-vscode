# Palavras mais comuns

Encontre as `k` palavras que mais aparecem em um texto. Uma **palavra** é uma sequência de letras: todo o resto (espaços, pontuação, dígitos, apóstrofos) separa palavras. Maiúsculas e minúsculas contam como a mesma palavra, e as palavras são impressas em minúsculas.

Ordene pela **contagem, da maior para a menor**. Palavras com a mesma contagem ficam em **ordem alfabética**.

Para `k = 2` e `The cat and the hat. The END, and the cat!`:

```
the: 4
and: 2
```

(`and` e `cat` aparecem duas vezes; `and` vem primeiro na ordem alfabética.)

**Entrada**

- Linha 1: `k` (1 ≤ k ≤ 100)
- Linha 2: o texto, com pelo menos uma letra

**Saída**

`word: count` para as `k` primeiras palavras, ou para todas se houver menos que `k`.

**O que você precisa saber**

- `text.toLowerCase().split("[^a-z]+")` divide em tudo que não é letra. O primeiro pedaço pode ser vazio se o texto começar com pontuação.
- `map.merge(word, 1, Integer::sum)` conta em uma linha.
- Um mapa não tem ordem, então copie `map.entrySet()` para uma `List` e ordene com `Comparator`: `Map.Entry.<String, Integer>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey())`.
