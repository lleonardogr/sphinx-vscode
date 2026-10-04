# Relatório de notas

Um professor precisa de um relatório rápido de uma prova. Leia as notas e imprima a média, a maior e a menor nota, e quantos alunos passaram. Uma nota de **60 ou mais** passa.

**Entrada**

- Linha 1: a quantidade de alunos `n` (1 ≤ n ≤ 100)
- Linha 2: `n` notas de 0 a 100

**Saída**

Quatro linhas, com a média com **duas** casas decimais:

```
Average: 72.50
Highest: 95
Lowest: 40
Passed: 3 of 4
```

**O que você precisa saber**

- Um só laço consegue acompanhar a soma, a maior nota, a menor nota e quantos passaram.
- Divida como `double` para a média, `(double) sum / n`, e imprima com `"%.2f"`.
- Comece a maior e a menor na primeira nota, ou em `Integer.MIN_VALUE` e `Integer.MAX_VALUE`.
