# Fatorial

O fatorial de `n` (escrito `n!`) é o produto de todos os números inteiros de 1 até `n`:

```
5! = 1 × 2 × 3 × 4 × 5 = 120
```

Por definição, `0! = 1`.

**Entrada**

Um inteiro `n` (0 ≤ n ≤ 20).

**Saída**

O valor de `n!`.

**O que você precisa saber**

- Comece o produto em `1` (não em `0`) e multiplique por cada número: `result *= i;`
- Fatoriais crescem rápido: `13!` já não cabe em um `int`. Use um `long`, que guarda até cerca de 9 × 10¹⁸, o suficiente para `20!`.
- Um laço de 1 até 0 roda zero vezes, então `0!` continua `1` sem precisar de caso especial.
