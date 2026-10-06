# Verificador de bits

Leia um número `n` e uma posição `k`, e imprima se o bit `k` de `n` é 1.

Os bits são numerados a partir da **direita**, começando do **0**. 13 é `1101` em binário: o bit 0 é 1, o bit 1 é 0, o bit 2 é 1 e o bit 3 é 1.

**Entrada**

Uma linha com dois números inteiros: `n` (0 ≤ n ≤ 2.147.483.647) e `k` (0 ≤ k ≤ 30).

**Saída**

`Bit k of n is 1` ou `Bit k of n is 0`, com os números preenchidos.

**O que você precisa saber**

- `n >> k` desloca os bits de `n` para a direita em `k` posições, então o bit `k` vai parar na posição 0.
- `x & 1` mantém só o bit mais à direita de `x`: é 1 ou 0.
- Trabalhe direto com os bits: métodos que transformam `n` em texto binário não valem aqui.
