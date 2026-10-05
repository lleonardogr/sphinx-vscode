# Pirâmide de números

Imprima uma pirâmide de números com `n` linhas. A linha `r` conta de `1` até `r` e depois volta até `1`, com um espaço entre os números.

Para `n = 4`:

```
1
1 2 1
1 2 3 2 1
1 2 3 4 3 2 1
```

**Entrada**

Um número inteiro `n` (1 ≤ n ≤ 9).

**Saída**

`n` linhas, como acima. Nenhuma linha começa ou termina com espaço.

**O que você precisa saber**

- Um laço dentro de outro se chama **laço aninhado**: o laço de fora escolhe a linha e os de dentro imprimem essa linha.
- O laço de dentro pode depender do de fora: `for (int i = 1; i <= row; i++)`.
- Laços também podem contar para trás: `for (int i = row - 1; i >= 1; i--)`.
