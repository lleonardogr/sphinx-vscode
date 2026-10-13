# Contar os bits

Quantos bits 1 um número tem? Códigos detectores de erros, programas de xadrez, compressão e criptografia perguntam isso com tanta frequência que os processadores têm uma instrução para isso, o **popcount**. Escreva você mesmo, junto com duas respostas parecidas: a **paridade** (se a contagem é par ou ímpar, a ideia por trás do bit de paridade) e a posição do bit 1 **mais alto**.

```
12  é 1100   →   12: ones=2 parity=even highest=3
7   é 111    →   7: ones=3 parity=odd highest=2
0            →   0: ones=0 parity=even highest=none
```

**Entrada**

- Linha 1: `t` (1 ≤ t ≤ 100)
- Depois `t` números inteiros de 0 a 4.294.967.295 (cabem num `uint32_t`)

**Saída**

Para cada número: `x: ones=N parity=even|odd highest=B`, com os bits numerados a partir de 0 (o mais à direita), e `B` igual a `none` para 0.

**Coisas para saber**

- `(x >> b) & 1` é o bit `b` de `x`.
- Leia e imprima um `uint32_t` com `%u`.
- Funções embutidas do compilador como `__builtin_popcount` não são permitidas: a graça são os deslocamentos e as máscaras.
