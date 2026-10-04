# Ano bissexto

Um ano é **bissexto** se:

- é divisível por 4, **e**
- **não** é divisível por 100, **a não ser que** também seja divisível por 400.

Então 2024 e 2000 são bissextos, mas 1900 e 2023 não são.

**Entrada**

Um ano (um inteiro positivo).

**Saída**

`Leap year` (bissexto) ou `Not a leap year` (não bissexto).

**O que você precisa saber**

- `%` testa divisibilidade: `year % 4 == 0` quer dizer "divisível por 4".
- `&&` (e), `||` (ou) e `!=` (diferente) combinam condições. Use parênteses para deixar a ordem clara: `a && (b || c)`.
- Uma variável `boolean` pode guardar a regra inteira: `boolean leap = …;`
