# Bubble sort

O **bubble sort** ordena um array fazendo **passadas**. Em cada passada, vá do começo ao fim comparando cada par de vizinhos, e **troque** os dois quando o da esquerda for maior. Os números grandes "sobem como bolhas" até o fim.

Depois de cada passada que trocou alguma coisa, imprima o array. Pare assim que uma passada **não fizer nenhuma troca** (não imprima essa passada) e então imprima o array ordenado.

Para `5 1 4 2 8`:

```
Pass 1: 1 4 2 5 8
Pass 2: 1 2 4 5 8
Sorted: 1 2 4 5 8
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros

**Saída**

Uma linha `Pass i:` por passada com trocas e depois `Sorted:` com o resultado.

**O que você precisa saber**

- Uma passada compara `a[j]` e `a[j + 1]` para `j` de `0` até `n - 2`. Parar em `n - 2` mantém `j + 1` dentro do array.
- Trocar dois elementos precisa de uma **variável temporária**.
- Um `boolean swapped` diz quando o array já está ordenado, para você parar antes. Escreva a ordenação você mesmo, sem `Arrays.sort`.
