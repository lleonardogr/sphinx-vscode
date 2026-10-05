# Letras iniciais maiúsculas

Reescreva uma frase com a **primeira letra de cada palavra maiúscula** e o resto minúsculo.

`the qUICK BROWN fox` vira `The Quick Brown Fox`.

**Entrada**

Uma linha com uma ou mais palavras feitas de letras, separadas por um espaço.

**Saída**

As mesmas palavras com a inicial maiúscula, separadas por um espaço.

**O que você precisa saber**

- `substring(0, 1)` é a primeira letra e `substring(1)` é tudo depois dela.
- `toUpperCase()` e `toLowerCase()` devolvem uma String nova; a original não muda.
- `String.join(" ", parts)` junta um array de Strings com um espaço entre cada uma.
