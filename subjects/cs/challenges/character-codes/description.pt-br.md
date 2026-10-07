# Códigos dos caracteres

Os computadores guardam texto como números: cada caractere tem um **código**. No ASCII, os códigos que todo mundo compartilha, `A` é 65, `a` é 97, o dígito `0` é 48 e o espaço é 32. O Java usa os mesmos códigos para esses caracteres.

Leia uma linha e imprima o código de cada um dos caracteres dela.

**Entrada**

Uma linha de texto com 1 a 50 caracteres: letras sem acento, dígitos, espaços e pontuação. Ela não começa nem termina com espaço.

**Saída**

Os códigos dos caracteres, em ordem, separados por espaços.

**O que você precisa saber**

- Um `char` é um número de 16 bits. `(int) c` mostra o número: `(int) 'A'` é `65`.
- Letras maiúsculas e minúsculas ficam a 32 de distância: `'a' - 'A'` é 32.
- Percorra a linha com um laço e `charAt`: `getBytes()`, `chars()` e `codePoints()` não valem aqui.
