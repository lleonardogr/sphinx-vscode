# Cifra de César

A cifra de César esconde uma mensagem trocando cada letra por outra mais à frente no alfabeto. Com deslocamento 3, `A` vira `D`, `b` vira `e`, e `z` dá a volta e vira `c`.

Codifique uma mensagem:

- letras maiúsculas continuam maiúsculas, e minúsculas continuam minúsculas;
- o que não for letra (espaços, dígitos, pontuação) continua igual.

**Entrada**

- Linha 1: o deslocamento `k` (0 ≤ k ≤ 25)
- Linha 2: a mensagem

**Saída**

A mensagem codificada.

**O que você precisa saber**

- Um `char` é um número: `'a' + 1` é `'b'`. Transforme o número de volta em caractere com `(char)`.
- Trabalhe com a posição no alfabeto: `(c - 'a' + k) % 26` faz o `z` voltar para o `a`; depois some `'a'` de novo.
- `Character.isUpperCase(c)` e `Character.isLowerCase(c)` dizem qual alfabeto usar. Copie o resto como está.
- Monte o resultado com um `StringBuilder` e depois imprima.

> Este desafio de exemplo tem as dicas de IA desligadas (`"aiHints": false`), do jeito que um professor faria numa questão de prova.
