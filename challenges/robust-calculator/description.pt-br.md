# Calculadora robusta

Uma calculadora lê linhas como `7 + 5`. Usuários digitam de tudo, então ela **nunca pode quebrar**: todo problema vira uma mensagem de erro, e a próxima linha continua sendo lida.

| Problema | Imprima |
|----------|---------|
| a linha não tem exatamente 3 partes | `Error: expected number operator number` |
| um número não é um `int` válido | `Error: not a number` |
| o operador não é `+ - * / %` | `Error: unknown operator ^` |
| `/` ou `%` por zero | `Error: division by zero` |
| o resultado não cabe em um `int` | `Error: overflow` |

Nos outros casos imprima `7 + 5 = 12` (divisão inteira e resto para `/` e `%`). Confira os problemas **na ordem da tabela**: `abc ^ 0` é `not a number`.

**Entrada**

- Linha 1: `t`, o número de linhas
- Depois, `t` linhas; as partes são separadas por um ou mais espaços

**Saída**

Uma linha por linha da entrada.

**O que você precisa saber**

- `CalculatorException` já está pronta. Lance ela no `calculate` para os problemas da calculadora, e capture no `main`.
- `Math.addExact(a, b)` (e `subtractExact`, `multiplyExact`) lançam uma `ArithmeticException` em vez de dar a volta em silêncio quando estouram, a mesma exceção da divisão por zero.
- Capturar uma exceção e **lançar outra** com uma mensagem mais clara é comum: esconde detalhes de que quem chamou não precisa.
