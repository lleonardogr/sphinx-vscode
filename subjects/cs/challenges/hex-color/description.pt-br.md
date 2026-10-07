# Cores em hexadecimal

Páginas da web e ferramentas de design escrevem cores em **hexadecimal**: `#FF8800` é laranja. Depois do `#` vêm três bytes, com dois dígitos hex cada: **vermelho** `FF` = 255, **verde** `88` = 136, **azul** `00` = 0. A forma curta `#f80` quer dizer a mesma cor: cada dígito é duplicado.

Os designers também precisam saber se o texto sobre essa cor deve ser **preto ou branco** para ficar legível. Nossos olhos são mais sensíveis ao verde e menos ao azul, então o **brilho** percebido pesa as três cores de forma diferente:

> brilho = 0,299 × R + 0,587 × G + 0,114 × B

Para o laranja: 0,299 × 255 + 0,587 × 136 + 0,114 × 0 ≈ **156**. Cores com brilho **128 ou mais** são claras, então texto preto fica bem legível nelas; cores mais escuras precisam de texto branco.

**Entrada**

Uma linha: `#` seguido de 6 dígitos hex, ou 3 na forma curta, maiúsculos ou minúsculos. A linha também pode ser inválida.

**Saída**

Três linhas: `rgb(R, G, B)`, depois `Brightness: ` e o brilho arredondado para um número inteiro, depois `Text: black` ou `Text: white`. Se a linha não começar com `#`, não tiver 3 ou 6 dígitos depois dele, ou tiver um caractere que não é dígito hex, imprima só `Invalid color`.

**O que você precisa saber**

- Um par de dígitos hex é o primeiro dígito × 16 + o segundo: `88` = 8 × 16 + 8 = 136.
- Para arredondar só com números inteiros: `(299 * r + 587 * g + 114 * b + 500) / 1000`.
- Converta os dígitos você mesmo: `Integer.parseInt(texto, 16)` não vale aqui.
