# Lendo um byte com sinal

Leia 8 bits que guardam um número em **complemento de dois** e imprima o número.

O bit mais à esquerda é o **sinal**: no complemento de dois ele vale **−128** em vez de +128, e os outros bits mantêm seus valores de posição de sempre. Então `11111011` é −128 + 64 + 32 + 16 + 8 + 2 + 1 = **−5**, e `00000101` é **5**.

**Entrada**

Exatamente 8 caracteres, cada um `0` ou `1`.

**Saída**

O número que eles guardam, de −128 a 127.

**O que você precisa saber**

- Valores das posições num byte com sinal: −128, 64, 32, 16, 8, 4, 2, 1.
- `bits.charAt(i)` dá o `i`-ésimo caractere; compare com `'1'`.
- Leia os bits você mesmo: `Integer.parseInt(bits, 2)` não vale aqui.
