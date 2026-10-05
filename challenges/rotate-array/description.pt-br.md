# Girar um array

Gire um array `k` posições para a **direita**: cada elemento anda `k` casas para a frente, e os que caem no fim voltam para o começo.

Girar `1 2 3 4 5` por `2` dá `4 5 1 2 3`.

**Entrada**

- Linha 1: `n k` (1 ≤ n ≤ 1000, 0 ≤ k ≤ 1.000.000.000)
- Linha 2: `n` inteiros

**Saída**

O array girado, com um espaço entre os números.

**O que você precisa saber**

- O elemento do índice `i` vai parar no índice `(i + k) % n`. O `%` faz o índice **dar a volta** para o começo.
- Girar por `n` devolve o mesmo array, então um `k` enorme se comporta como `k % n`. Não gire uma casa por vez um bilhão de vezes.
- Escrever o resultado em um **array novo** é mais fácil do que mover os elementos no lugar.
