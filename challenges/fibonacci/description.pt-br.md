# Fibonacci (memoização)

Na **sequência de Fibonacci**, cada número é a soma dos dois anteriores:

```
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …
```

Então `fib(0) = 0`, `fib(1) = 1`, e `fib(n) = fib(n − 1) + fib(n − 2)`. Escreva `fib` de forma recursiva, e rápida o bastante para `n = 90`.

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 90).

**Saída**

`F(10) = 55`

**O que você precisa saber**

- A versão recursiva simples chama `fib(n − 2)` duas vezes, `fib(n − 3)` três vezes, e assim por diante: para `n = 90` são mais chamadas do que um computador faz em anos.
- A **memoização** resolve: guarde cada resposta em um array na primeira vez que calcular, e devolva o valor guardado nas próximas. Assim cada `fib(k)` é calculado uma vez.
- `fib(90)` é cerca de 2,9 × 10¹⁸, então use `long`.
