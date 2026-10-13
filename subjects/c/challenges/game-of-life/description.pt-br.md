# Jogo da Vida

Em 1970 o matemático John Conway inventou um "jogo" sem jogadores: uma grade de células, cada uma viva ou morta, que muda sozinha uma geração por vez. Quatro regras bastam para planadores que atravessam a grade, piscas e padrões que crescem para sempre, e por isso o Jogo da Vida ficou famoso muito além da matemática.

Para cada célula, conte os **vizinhos** vivos, as 8 células em volta:

- uma célula viva com 2 ou 3 vizinhos vivos continua viva; senão, morre;
- uma célula morta com exatamente 3 vizinhos vivos nasce.

Todas as células mudam **ao mesmo tempo**, a partir da mesma geração antiga. Células fora da grade contam como mortas.

Leia uma grade e imprima-a depois de `g` gerações. Uma linha de três pisca:

```
...         .#.
###   →1→   .#.
...         .#.
```

**Entrada**

- Linha 1: as linhas e as colunas (1 a 50 cada) e `g`, o número de gerações (0 ≤ g ≤ 100)
- Depois a grade, uma linha por linha: `#` para viva, `.` para morta

**Saída**

A grade depois de `g` gerações, no mesmo formato.

**Coisas para saber**

- `char grid[50][50]` guarda a grade: `grid[r][c]` é a linha `r`, coluna `c`.
- `scanf(" %c", &grid[r][c])` lê a próxima célula, pulando as quebras de linha.
- Como todas as células mudam juntas, não dá para atualizar a grade enquanto ainda está lendo ela: monte a próxima geração separadamente.
