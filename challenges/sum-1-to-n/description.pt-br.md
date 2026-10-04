# Soma de 1 a N

Some todos os números inteiros de 1 até `n`. Por exemplo, para `n = 5` a resposta é `1 + 2 + 3 + 4 + 5 = 15`. Use um laço que vai acumulando o total.

**Entrada**

Um inteiro `n` (1 ≤ n ≤ 10000).

**Saída**

A soma.

**O que você precisa saber**

- Guarde o total em uma variável declarada **antes** do laço: `int sum = 0;`
- Dentro do laço, `sum += i;` soma o número atual.
- Imprima o total **depois** do laço, uma vez só. Para n = 10000 a soma é 50 005 000, que ainda cabe em um `int`.
