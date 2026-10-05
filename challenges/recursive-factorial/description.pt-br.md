# Fatorial recursivo

Um método **recursivo** resolve um problema chamando **a si mesmo** em uma versão menor do problema. O fatorial é o exemplo clássico:

- `0! = 1`
- `n! = n × (n − 1)!`

Então `5! = 5 × 4! = 5 × 4 × 3! = … = 120`. Escreva `factorial` desse jeito, sem laços.

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 20).

**Saída**

`5! = 120`

**O que você precisa saber**

- O **caso base** (`n` é 0 ou 1) devolve a resposta direto. Sem ele, o método chamaria a si mesmo para sempre e quebraria com um `StackOverflowError`.
- O **caso recursivo** precisa andar em direção ao caso base: `factorial(n - 1)` fica um passo menor a cada vez.
- `20!` é cerca de 2,4 × 10¹⁸, que cabe em um `long` mas não em um `int`.
