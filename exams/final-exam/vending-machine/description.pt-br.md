# Máquina de venda

Complete `VendingMachine.select`. Ele vende o produto com o código informado, usando o crédito que o cliente colocou, e **lança uma `VendingException`** quando não consegue:

| Problema (conferido nesta ordem) | Mensagem |
|----------------------------------|----------|
| nenhum produto tem esse código | `Unknown product CODE` |
| o estoque do produto é 0 | `Sold out: NAME` |
| o crédito é menor que o preço | `Insert N more cents` |

Quando dá certo, o estoque diminui 1, o crédito volta para 0, e `select` devolve o troco. Quando falha, nada muda.

No `main`, imprima `Dispensed NAME, change C` ou `Error:` seguido da mensagem. `insert` e `refund` já estão prontos.

**Entrada**

- Linha 1: `k`; depois `k` linhas `CODE NAME PRICE STOCK` (preços em centavos)
- Depois `n`; depois `n` comandos: `insert CENTS`, `select CODE` ou `refund`

**Saída**

Uma linha por comando.

**O que você precisa saber**

- Lançar a exceção para o `select` na hora, então faça todas as verificações **antes** de mudar o estoque ou o crédito.
- `VendingException` estende `Exception`, então é verificada: a chamada precisa estar dentro de `try` / `catch`.
- `e.getMessage()` devolve a mensagem passada ao construtor da exceção.
