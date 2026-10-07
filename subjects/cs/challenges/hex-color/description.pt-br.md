# Cores em hexadecimal

Páginas da web e ferramentas de design escrevem cores em **hexadecimal**: `#FF8800` é laranja. Depois do `#` vêm três bytes, com dois dígitos hex cada: **vermelho** `FF` = 255, **verde** `88` = 136 e **azul** `00` = 0. A forma curta `#f80` quer dizer a mesma cor: cada dígito é duplicado.

Leia uma cor em hex e imprima-a na forma `rgb(…)` que o CSS também entende.

**Entrada**

Uma linha: `#` seguido de 6 dígitos hex, ou de 3 na forma curta. Os dígitos podem ser maiúsculos ou minúsculos. A linha também pode ser inválida.

**Saída**

`rgb(R, G, B)` com os três valores de 0 a 255, ou `Invalid color` se a linha não começar com `#`, não tiver 3 ou 6 dígitos depois dele, ou tiver um caractere que não é dígito hex.

**O que você precisa saber**

- Um par de dígitos hex é o primeiro dígito × 16 + o segundo: `88` = 8 × 16 + 8 = 136.
- `Character.toUpperCase(c)` deixa você tratar `a` e `A` igual; `"0123456789ABCDEF".indexOf(c)` dá o valor de um dígito, ou −1 para qualquer outra coisa.
- Converta os dígitos você mesmo: `Integer.parseInt(texto, 16)` não vale aqui.
