# O maior de três

Leia três números inteiros e imprima o **maior** deles. Dois números, ou até os três, podem ser iguais; nesse caso, imprima esse valor uma vez. Resolva com comparações e `if`: `Math.max` não é permitido aqui.

**Entrada**

Uma linha com três inteiros `a b c`.

**Saída**

O maior dos três números.

**O que você precisa saber**

- Os operadores de comparação são `>`, `>=`, `<`, `<=`, `==` e `!=`. Cada um dá um `boolean`.
- `&&` quer dizer "e": `a >= b && a >= c` só é verdadeiro quando as duas comparações são.
- O código inicial já separa a linha em três números com `split(" ")` e `Integer.parseInt`.
