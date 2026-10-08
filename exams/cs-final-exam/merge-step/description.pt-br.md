# Passo de intercalação

Dois servidores escrevem logs em ordem de tempo, e você quer **um** log em ordem de tempo. Daria para juntar tudo e ordenar, mas há um jeito mais rápido: como cada lista já está ordenada, o menor número que sobrou está sempre na **frente** de uma delas. Compare as duas frentes, pegue a menor e repita. Essa **intercalação** (merge) é o coração do merge sort, e precisa de no máximo n + m − 1 comparações em vez de uma ordenação completa.

Quando as duas frentes são iguais, pegue a da primeira lista. Quando uma lista acaba, o resto da outra é copiado sem comparações.

Para `1 4 9 12` e `2 3 10`: 1 < 2, 4 > 2, 4 > 3, 4 < 10, 9 < 10, 12 > 10, depois o 12 é copiado. São **6 comparações**.

Leia as duas listas, confira se cada uma está ordenada e intercale-as.

**Entrada**

Quatro linhas: a quantidade `n` (1 a 100), os `n` números da lista A, a quantidade `m` (1 a 100) e os `m` números da lista B.

**Saída**

Se a lista A não estiver em ordem crescente (vizinhos iguais podem), imprima `List A is not sorted`; senão, se a lista B não estiver, imprima `List B is not sorted`. Caso contrário, imprima duas linhas: os números intercalados separados por espaços, e `Comparisons: C`.

**Para saber**

- Um índice por lista, `i` e `j`, avançando independentemente.
- `while (i < n && j < m)` roda só enquanto as duas listas ainda têm números.
