# Notas da prova

Uma prova nacional tem centenas de milhares de inscritos, cada um com nota de 0 a 100. O relatório mostra quantos alunos tiraram cada nota, de cima para baixo, e a mediana.

Com só 101 notas possíveis, nem é preciso comparar notas: **conte**. Uma passada preenche os contadores, e os contadores já são as notas ordenadas.

Para as notas `70 85 70 100 55 85 70`:

```
100: 1
85: 2
70: 3
55: 1
median: 70
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: `n` notas de 0 a 100

**Saída**

- Uma linha por nota que aparece, da maior para a menor: a nota, `: ` e quantos alunos a tiraram.
- Depois `median: ` e o valor na posição (n − 1) / 2 das notas ordenadas, contando a partir de 0. Com `n` par, é o menor dos dois valores do meio.

**Bom saber**

- `int[] counts = new int[101];` tem um contador por nota possível, e `counts[nota]++` soma um.
- Contar leva O(n + 101) passos, mais rápido que qualquer ordenação que compara notas.
- Não ordene: o desafio é deixar os contadores fazerem isso.
