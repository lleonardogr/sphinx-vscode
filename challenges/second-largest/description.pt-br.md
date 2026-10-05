# Segundo maior

Encontre o **segundo maior valor diferente** de um array. Em `4 9 2 9 7` o maior é `9` e o segundo maior é `7` (o segundo `9` não conta, porque é o mesmo valor).

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 1000)
- Linha 2: `n` inteiros

**Saída**

`Second largest: 7`, ou `No second largest` quando todos os valores são iguais.

**O que você precisa saber**

- Dá para resolver em **uma passada** com duas variáveis: `largest` e `second`. Quando aparece um novo maior, o antigo maior desce para `second`.
- `Integer.MIN_VALUE` é o menor `int`. Ele também pode aparecer na entrada, então use um `boolean` para lembrar se `second` foi mesmo encontrado.
- Resolva com laços, sem ordenar o array.
