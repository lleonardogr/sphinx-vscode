# Maior sequência

Um aplicativo de exercícios registra os dias em que a pessoa treinou, como números de dia, sem ordem e às vezes repetidos. A tela de medalhas mostra a **maior sequência**: o maior número de dias seguidos com treino.

Para os dias `10 4 20 1 3 2 11` a maior sequência é 1, 2, 3, 4:

```
longest streak: 4
starts on day: 1
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: `n` números de dia (0 a 1.000.000.000), em qualquer ordem, podendo repetir

**Saída**

`longest streak: ` e o tamanho dela, depois `starts on day: ` e seu primeiro dia (o mais cedo num empate).

**Bom saber**

- Procurar d + 1 varrendo a lista inteira é O(n) por dia, O(n²) no total.
- Um `HashSet<Integer>` responde `contains(d + 1)` em cerca de O(1).
- Só comece a contar a partir de um dia cujo dia anterior não está lá, senão as sequências longas são contadas de novo e de novo.
