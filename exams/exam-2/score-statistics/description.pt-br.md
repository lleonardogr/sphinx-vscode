# Estatísticas das notas

Leia as notas de uma turma e imprima um resumo:

```
Highest: 90
Lowest: 38
Passed: 3 of 5
```

Nota **60 ou mais** é aprovado. O exemplo é para as notas `72 45 90 60 38`.

**Entrada**

- Linha 1: `n`, o número de alunos (1 a 100)
- Linha 2: `n` notas de 0 a 100

**Saída**

As três linhas acima.

**O que você precisa saber**

- Guarde as notas em um `int[]` e percorra com um laço.
- Comece `highest` e `lowest` com a primeira nota, assim você não precisa de valores iniciais especiais.
- Conte as notas aprovadas com uma variável que começa em 0.
