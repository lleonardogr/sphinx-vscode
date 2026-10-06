# Frações em binário

Leia um número entre 0 e 1 e escreva-o em **binário**, com até **12 bits** depois da vírgula.

Depois da vírgula binária, as posições valem **½, ¼, ⅛, 1/16, …** Então `0.101` em binário é ½ + ⅛ = **0,625**. Algumas frações nunca terminam em binário: 0,1 é `0.000110011001100…` para sempre. É por isso que `0.1 + 0.2` não dá exatamente `0.3` no Java.

Para achar os bits, **dobre** o número de novo e de novo. A cada vez, a parte inteira (0 ou 1) é o próximo bit; fique só com a fração e continue. Para 0,625: 1,25 → **1**, 0,5 → **0**, 1,0 → **1**, e a fração agora é 0, então a resposta é `0.101`.

**Entrada**

Um número `x` com 0 ≤ x < 1, escrito em decimal com ponto e até 13 dígitos depois dele.

**Saída**

`0.` seguido dos bits. Pare assim que a fração ficar exatamente 0. Se ainda sobrarem bits depois de 12, imprima os 12 primeiros seguidos de `...`. Zero é `0.0`.

**O que você precisa saber**

- Num `double`, multiplicar por 2 e subtrair 1 são operações exatas, então isso acha os bits que o computador guarda de verdade.
- `x * 2 >= 1` diz se o próximo bit é 1.
- Ache os bits você mesmo: métodos que mostram os bits de um double, como `Double.doubleToLongBits`, não valem aqui.
