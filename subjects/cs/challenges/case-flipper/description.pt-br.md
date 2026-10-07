# Inversor de maiúsculas

Os computadores guardam cada caractere como um número, o seu **código**. No ASCII, os códigos compartilhados por quase todos os sistemas, as letras maiúsculas de `A` a `Z` são **65 a 90** e as minúsculas de `a` a `z` são **97 a 122**. Cada letra minúscula fica exatamente **32** depois da sua maiúscula, então trocar maiúscula por minúscula é só somar ou subtrair 32.

Leia uma linha e inverta maiúsculas e minúsculas de cada letra.

**Entrada**

Uma linha de texto com 1 a 80 caracteres: letras sem acento, dígitos, espaços e pontuação.

**Saída**

A mesma linha com cada letra maiúscula virando minúscula e cada minúscula virando maiúscula. Todo o resto fica igual.

**O que você precisa saber**

- No Java um `char` é um número: `'a' - 'A'` é `32`, e `(char) ('c' - 32)` é `'C'`.
- Confira a faixa antes de mudar um caractere: `[`, `` ` ``, `@` e `{` ficam bem ao lado das letras, mas não são letras.
- Use os códigos: `toUpperCase`, `toLowerCase` e `isUpperCase` não valem aqui.
