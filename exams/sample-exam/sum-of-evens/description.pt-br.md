# Soma dos pares

Leia uma lista de números e imprima a soma dos **pares** (0 se não houver nenhum).

**Entrada**

- Linha 1: a quantidade de valores `n` (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros separados por um espaço

**Saída**

A soma dos números pares.

**O que você precisa saber**

- `n % 2 == 0` testa se é par, e funciona com números negativos também.
- Mantenha um total acumulado que começa em `0`. Se nenhum número for par, `0` é a resposta certa.
