# Decimal para binário

Todo número que o seu programa usa é guardado como bits. Esta é a conversão que o computador faz sempre que você digita um número.

Leia um número em **decimal** e imprima-o em **binário**.

Divida por 2 repetidamente e anote os restos. Lendo os restos do **último** para o primeiro, você tem o número binário. Para 13: 13 ÷ 2 = 6 resto **1**, 6 ÷ 2 = 3 resto **0**, 3 ÷ 2 = 1 resto **1**, 1 ÷ 2 = 0 resto **1**, então 13 é **1101**.

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 1.000.000.000).

**Saída**

`n` em binário, sem zeros à esquerda (`0` para zero).

**O que você precisa saber**

- `n % 2` é o resto (o próximo bit) e `n / 2` é o quociente (o que falta).
- O primeiro resto que você obtém é o bit **mais à direita**, então coloque cada bit novo na **frente** do texto: `bits = (n % 2) + bits;`
- Faça a conversão você mesmo: `Integer.toBinaryString(n)` não vale aqui.
