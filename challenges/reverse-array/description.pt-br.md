# Inverter um array

Leia `n` números para dentro de um array e imprima eles em **ordem inversa**, na mesma linha, separados por espaços.

**Entrada**

- Linha 1: um inteiro `n`, a quantidade de elementos (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros separados por espaços

**Saída**

Os números do último para o primeiro, separados por um espaço. (Um espaço sobrando no final não tem problema.)

**O que você precisa saber**

- `numbers.length` é o tamanho do array, então o último elemento é `numbers[numbers.length - 1]`.
- Um laço pode contar para trás: `for (int i = numbers.length - 1; i >= 0; i--)`.
- Imprima na mesma linha com `IO.print(numbers[i] + " ")` e termine com `IO.println()`.
