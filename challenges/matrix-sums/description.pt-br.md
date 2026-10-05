# Somas da matriz

Uma **matriz** é uma grade de números com linhas e colunas. Leia uma e imprima a soma de cada linha, a soma de cada coluna e o total.

Para

```
1 2 3
4 5 6
```

a saída é

```
Row sums: 6 15
Column sums: 5 7 9
Total: 21
```

**Entrada**

- Linha 1: `rows cols` (de 1 a 20 cada)
- Depois, `rows` linhas com `cols` inteiros

**Saída**

As três linhas acima, com as somas separadas por um espaço.

**O que você precisa saber**

- Um array 2D é um array de arrays: `int[][] grid = new int[rows][cols];` e `grid[r][c]` é a linha `r`, coluna `c`.
- **Laços aninhados** percorrem a grade: o de fora escolhe uma linha (ou coluna) e o de dentro anda por ela.
- `grid.length` é o número de linhas, e `grid[0].length` o número de colunas.
