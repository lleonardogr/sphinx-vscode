# Passo a passo da ordenação por seleção

A **ordenação por seleção** é um dos algoritmos de ordenação mais simples. Na passada 1 ela acha o **menor** número e o troca para a primeira posição; na passada 2 ela acha o menor do resto e o troca para a segunda posição, e assim por diante. Depois de `n − 1` passadas, a lista está ordenada.

Para `29 10 14 37 13`:

| Passada | Menor do resto | Lista depois da passada |
|---------|----------------|-------------------------|
| 1 | 10 | `10 29 14 37 13` |
| 2 | 13 | `10 13 14 37 29` |
| 3 | 14 (já no lugar) | `10 13 14 37 29` |
| 4 | 29 | `10 13 14 29 37` |

Leia uma lista, ordene-a com a ordenação por seleção e mostre cada passada.

**Entrada**

Duas linhas: a quantidade `n` (2 ≤ n ≤ 50) e os `n` números.

**Saída**

A lista depois de cada uma das `n − 1` passadas, uma linha cada, com os números separados por espaços. Depois `Comparisons: ` e o número de comparações entre dois números, e `Swaps: ` e o número de trocas. Uma passada cujo menor número já está no lugar não faz troca.

**O que você precisa saber**

- Para achar o menor das posições `i` a `n − 1`, comece com `min = i` e compare `numbers[j] < numbers[min]` para cada `j` seguinte: uma comparação cada.
- A ordenação por seleção sempre faz `n × (n − 1) / 2` comparações, então cresce como **n²**.
- Ordene você mesmo: `Arrays.sort` não vale aqui.
