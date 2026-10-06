# Conversor de bases

Converta um número de **qualquer base para qualquer base**, de 2 a 36. Os dígitos vão de `0` a `9` e depois de `A` (10) a `Z` (35), então a base 16 usa `0`–`F` e a base 36 usa `0`–`Z`. As letras podem vir maiúsculas ou minúsculas.

Por exemplo, `255 10 16` converte 255 da base 10 para a base 16: **FF**.

Confira a entrada nesta ordem:

1. Se uma base estiver fora de 2 a 36, imprima `Invalid base`.
2. Se um dígito não valer na base de origem, imprima `Invalid digit X for base B`, com o **primeiro** dígito inválido do jeito que foi digitado (na base 10, `A` não é dígito).
3. Senão, imprima o número na base de destino, com letras maiúsculas.

**Entrada**

Uma linha: o número, a base de origem e a base de destino, separados por espaços. O valor do número é no máximo 9.223.372.036.854.775.807 (o maior `long`).

**Saída**

O número convertido, `Invalid base` ou `Invalid digit X for base B`.

**O que você precisa saber**

- Passar **por um `long`** deixa tudo simples: converta da base de origem para um valor e depois do valor para a base de destino. Dois métodos, um para cada direção.
- Da base b para um valor: `value = value * b + digit`, da esquerda para a direita. De um valor para a base b: divisões sucessivas por `b`, lendo os restos do último para o primeiro.
- Uma `String` com os 36 dígitos funciona como tabela nas duas direções: `indexOf` dá o valor de um dígito e `charAt` dá o dígito de um valor. Escreva as conversões você mesmo, sem `Long.parseLong(texto, base)`, `Long.toString(valor, base)` ou `Character.digit`.
