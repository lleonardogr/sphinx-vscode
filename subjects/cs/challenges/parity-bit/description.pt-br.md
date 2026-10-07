# Bit de paridade

Bits podem mudar no caminho: um arranhão num disco, ruído num cabo. A proteção mais simples é um **bit de paridade**. Quem envia conta os 1s dos dados e acrescenta mais um bit para que o total seja **par**. Quem recebe conta de novo: se o total for ímpar, algo deu errado.

13 é `1101`: três 1s, então o bit de paridade é **1** (3 + 1 = 4, par). Se o 13 chegar como 9 (`1001`), quem recebe conta dois 1s, então a paridade não confere mais: **erro detectado**. Mas se dois bits mudarem, a contagem volta a ser par e o erro passa sem ser notado.

Leia o número que foi enviado e o número que chegou, e confira.

**Entrada**

Uma linha com dois números inteiros de 0 a 2.147.483.647: o valor enviado e o valor recebido.

**Saída**

Três linhas: `Ones: ` e o número de bits 1 do valor enviado, `Parity bit: ` e o bit de paridade par dele, e `Received: OK` se o valor recebido tiver a mesma paridade, ou `Received: error detected` se não tiver.

**O que você precisa saber**

- `n & 1` é o último bit de `n`, e `n >> 1` desloca os bits para a direita, descartando-o. Repita enquanto `n > 0`.
- O bit de paridade par é `uns % 2`.
- Conte os bits você mesmo: `Integer.bitCount` não vale aqui.
