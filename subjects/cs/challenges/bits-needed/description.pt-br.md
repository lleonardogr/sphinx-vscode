# Bits necessários

Leia um número inteiro e imprima quantos **bits** são necessários para escrevê-lo em binário, e quantos **bytes** isso dá.

255 é `11111111` em binário: **8** bits, que cabem em **1** byte. 256 é `100000000`: **9** bits, então precisa de **2** bytes. Cada bit a mais dobra até onde dá para contar.

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 10¹⁸).

**Saída**

Duas linhas: `Bits: ` seguido da quantidade de bits, e `Bytes: ` seguido da quantidade de bytes inteiros necessária para esses bits.

**O que você precisa saber**

- Cada divisão por 2 remove um dígito binário, então o número de vezes que dá para dividir `n` ao meio até chegar a 0 é a quantidade de bits dele. O zero é escrito como `0`: 1 bit.
- Um byte tem 8 bits. Para arredondar uma divisão para cima, some 7 antes de dividir: `(bits + 7) / 8`.
- Leia `n` como `long`: 10¹⁸ não cabe num `int`.
