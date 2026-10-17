# Rastro do merge

Bancos de dados ordenam dados grandes demais para a memória ordenando pedaços e **intercalando** os pedaços, e o Java também ordena listas de objetos com um merge sort. O coração disso é a intercalação: duas sequências ordenadas viram uma, pegando sempre o menor valor da frente.

Rode um **merge sort de baixo para cima** e mostre cada passada:

1. Comece com sequências de largura 1 (cada valor sozinho está ordenado).
2. Intercale sequências vizinhas: as posições `[0, w)` com `[w, 2w)`, depois `[2w, 3w)` com `[3w, 4w)`, e assim por diante. Uma sequência sem par no fim fica como está.
3. Dobre a largura e repita enquanto ela for menor que `n`.

Ao intercalar, pegue o valor da esquerda num empate, e conte uma **comparação** cada vez que comparar dois valores da frente.

Para `5 2 8 1 9 3 7 4`:

```
width 1: 2 5 1 8 3 9 4 7
width 2: 1 2 5 8 3 4 7 9
width 4: 1 2 3 4 5 7 8 9
comparisons: 17
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 64)
- Linha 2: `n` inteiros entre −1.000 e 1.000

**Saída**

Para cada passada, `width ` e a largura, `: ` e o array depois da passada, separado por espaços. Depois `comparisons: ` e o total. (Com `n = 1` não há passadas: imprima só as comparações.)

**Bom saber**

- Numa passada de largura `w`, uma intercalação vai de `lo` até `mid = min(lo + w, n)` e `hi = min(lo + 2w, n)`.
- Quando uma sequência acaba, copie o resto da outra sem comparar.
- Nada de ordenação da biblioteca: intercalar é o exercício.
