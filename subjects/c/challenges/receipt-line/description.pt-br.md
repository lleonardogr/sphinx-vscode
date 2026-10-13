# Linha do recibo

Uma caixa registradora imprime cada linha do recibo em colunas fixas, para os preços ficarem alinhados qualquer que seja o número de dígitos. No C, o `printf` alinha por você com **larguras de campo**.

Leia os itens de uma compra e imprima o recibo:

```
  2 x    3.50 =     7.00
  1 x   12.99 =    12.99
 10 x    0.25 =     2.50
------------------------
TOTAL              22.49
```

Cada linha de item tem a quantidade em 3 caracteres, ` x `, o preço unitário em 7 caracteres com 2 casas, ` = `, e o total da linha em 8 caracteres com 2 casas. Depois vêm 24 traços, e `TOTAL` com o total alinhado à direita até o fim das 24 colunas.

**Entrada**

- Linha 1: `n`, o número de itens (0 ≤ n ≤ 20)
- Depois `n` linhas com uma quantidade (1 a 99) e um preço unitário (0.01 a 999.99, sempre com 2 casas)

**Saída**

As `n` linhas de item, os traços e a linha `TOTAL`, como acima.

**Coisas para saber**

- `%3d` imprime um `int` em pelo menos 3 caracteres, completando com espaços à esquerda. `%7.2f` imprime um `double` em pelo menos 7 caracteres, com 2 casas.
- Leia um `double` com `%lf` no `scanf`, mas imprima com `%f` no `printf`.
- Sem itens, o recibo ainda tem os traços e `TOTAL` com `0.00`.
