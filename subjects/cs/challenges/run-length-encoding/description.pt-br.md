# Codificação por comprimento de sequência

Imagens muitas vezes têm longas sequências da mesma cor, como um fundo branco. A **codificação por comprimento de sequência** (RLE, run-length encoding) guarda cada sequência como uma **contagem** e um **valor**: `WWWWWWWWWWWWB` vira `12W1B`. Ela é **sem perda**: decodificar devolve exatamente o original. Aparelhos de fax, os formatos de imagem BMP e TIFF e muitas outras ferramentas a usam.

Escreva um codificador e um decodificador para textos feitos de letras maiúsculas.

**Entrada**

Duas linhas. A primeira é `encode` ou `decode`. A segunda é o texto a codificar (1 a 100 letras de `A` a `Z`), ou um código a decodificar: sequências escritas como uma contagem seguida de uma letra, como `4A3B2C1D`.

**Saída**

Duas linhas: o resultado, depois `Length: ` com o tamanho antes e depois, como `10 -> 8`. Se um código a decodificar for inválido (termina com dígitos, uma letra não tem contagem, ou uma contagem é 0), imprima só `Invalid code`.

**O que você precisa saber**

- A RLE só ajuda quando há sequências: `ABCDEF` vira `1A1B1C1D1E1F`, duas vezes mais longo. Formatos de verdade acrescentam truques para evitar isso.
- Uma contagem pode ter vários dígitos: `12W` são doze Ws.
- Monte a saída com um `StringBuilder`; expressões regulares e `java.util.zip` não valem aqui.
