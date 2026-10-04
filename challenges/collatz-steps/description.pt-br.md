# Passos de Collatz (while)

Comece com um número `n` e repita:

- se `n` é par, divida por 2;
- se `n` é ímpar, troque por `3 × n + 1`;

até `n` virar 1. Ninguém provou que isso sempre chega a 1 (é a famosa conjectura de Collatz), mas chega para todo número já testado.

Imprima quantos **passos** isso leva. Por exemplo, 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 leva 8 passos.

**Use um laço `while`.** Você não sabe antes quantos passos serão, e é exatamente para isso que serve o `while`.

**Entrada**

Um inteiro `n` (1 ≤ n ≤ 1.000.000).

**Saída**

O número de passos até chegar a 1.

**O que você precisa saber**

- `while (n != 1) { … steps++; }` repete até a condição ficar falsa.
- `n % 2 == 0` testa se é par.
- Os valores podem subir muito acima do número inicial: a partir de 837 799 eles passam de 2,9 bilhões, mais do que um `int` guarda (cerca de 2,1 bilhões). Use um `long` para `n`.
