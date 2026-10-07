# Passos da busca

Leia uma lista de números **ordenada** e um alvo, e conte quantos números cada busca precisa olhar para achá-lo.

- A **busca linear** olha os números do primeiro ao último, até achar o alvo.
- A **busca binária** olha o número do **meio** do intervalo em que está procurando (`mid = (lo + hi) / 2`, começando com a lista inteira). Se ele não for o alvo, fica só com a metade em que o alvo pode estar, e repete.

Em `1 3 5 7 9 11 13 15 17 19`, a busca linear acha o 7 no 4º passo. A busca binária olha o 9 (índice 4), depois o 3 (índice 1), depois o 5, depois o 7: 4 passos. Para o 19, a busca linear precisa de 10 passos, mas a binária só de 4.

**Entrada**

Três linhas: a quantidade `n` (1 ≤ n ≤ 100), os `n` números em ordem crescente e o alvo.

**Saída**

Três linhas: `Linear: ` e os passos dela, `Binary: ` e os passos dela, e `Found: yes` ou `Found: no`. Quando o alvo não está na lista, cada busca conta todos os números que olhou antes de desistir.

**O que você precisa saber**

- A busca binária só funciona numa lista **ordenada**, mas divide o intervalo ao meio a cada passo: 1.000.000 de números precisam de no máximo 20 passos.
- Guarde `lo` e `hi`: se o número do meio for pequeno demais, faça `lo = mid + 1`; se for grande demais, `hi = mid - 1`.
- Escreva as duas buscas você mesmo: `Arrays.binarySearch` não vale aqui.
