# Complemento de dois

Leia um número inteiro entre −128 e 127 e imprima como ele é guardado em **um byte**, usando **complemento de dois**: exatamente 8 bits.

Números positivos são escritos em binário como sempre, com zeros à esquerda: 5 é `00000101`. Um número negativo é guardado como se 256 fosse somado a ele: −5 é guardado como 251, que é `11111011`. É o mesmo que inverter todos os bits de 5 e somar 1.

**Entrada**

Um número inteiro `n` (−128 ≤ n ≤ 127).

**Saída**

Os 8 bits que guardam `n`.

**O que você precisa saber**

- Em 8 bits, o complemento de dois guarda um `n` negativo como `n + 256`. O bit mais à esquerda é sempre 1; para números positivos e zero ele é 0.
- Escreva os bits da direita para a esquerda com `% 2` e `/ 2`, e rode o laço exatamente 8 vezes para ter os zeros à esquerda.
- Escreva os bits você mesmo: `Integer.toBinaryString` não vale aqui.
