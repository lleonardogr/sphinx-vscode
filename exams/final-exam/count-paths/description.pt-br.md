# Contar caminhos

Um robô começa na casa **de cima à esquerda** de uma grade e quer chegar na casa **de baixo à direita**. Ele só anda para a **direita** ou para **baixo**, e não pode pisar nas casas bloqueadas (`#`). Quantos caminhos diferentes existem?

Para

```
...
.#.
...
```

existem **2** caminhos: direita-direita-baixo-baixo e baixo-baixo-direita-direita.

Complete o método recursivo `paths(row, col)`, que conta os caminhos de uma casa até o fim. O `main` está pronto.

**Entrada**

- Linha 1: `rows cols` (de 1 a 18 cada)
- Depois, `rows` linhas de `cols` caracteres, `.` (livre) ou `#` (bloqueada)

**Saída**

`Paths: N`. Se o começo ou o fim estiver bloqueado, `N` é `0`.

**O que você precisa saber**

- De uma casa, todo caminho vai primeiro para baixo ou para a direita, então `paths(r, c) = paths(r + 1, c) + paths(r, c + 1)`.
- Casos base: fora da grade ou em `#` não há caminhos; a casa final tem exatamente um.
- Uma grade 18 × 18 tem bilhões de caminhos, e a recursão simples visitaria cada um. A **memoização** (`memo[r][c]`, começando em `-1`) calcula cada casa uma vez.
