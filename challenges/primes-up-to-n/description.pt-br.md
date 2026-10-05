# Primos até N

Um **número primo** é um inteiro maior que `1` que só é divisível por `1` e por ele mesmo. `7` é primo; `9` não, porque `9 = 3 × 3`.

Imprima todos os primos de `2` até `n` em uma linha, separados por espaços, e depois quantos são.

Para `n = 10`:

```
2 3 5 7
Count: 4
```

**Entrada**

Um número inteiro `n` (1 ≤ n ≤ 10.000).

**Saída**

- Linha 1: os primos até `n`, separados por espaços. Se não houver nenhum, imprima `No primes`.
- Linha 2: `Count: k`.

**O que você precisa saber**

- Você precisa de um **laço aninhado**: o laço de fora passa pelos candidatos e o de dentro procura um divisor.
- Uma variável `boolean` como `isPrime` lembra se o laço de dentro achou um divisor.
- Basta testar divisores até a raiz quadrada: se `k` tem um divisor maior que `√k`, também tem um menor. Escreva o teste como `d * d <= k`.
