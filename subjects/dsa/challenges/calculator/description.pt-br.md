# Calculadora

Toda calculadora, planilha e compilador precisa respeitar a **precedência**: em `2 + 3 * 4` a multiplicação vem primeiro. O jeito clássico de fazer isso, o algoritmo *shunting-yard* de Dijkstra, lê a expressão uma vez com **duas pilhas**: uma para números e outra para operadores.

Calcule cada expressão:

- números inteiros, `+`, `-`, `*`, `/` e parênteses, com quaisquer espaços;
- `*` e `/` antes de `+` e `-`; precedência igual vai da esquerda para a direita, então `8 - 3 - 2` dá 3;
- `/` é a divisão inteira que descarta as casas decimais, como a do Java (`7 / 2` dá 3);
- dividir por zero imprime `error: division by zero`.

```
2 + 3 * 4       → 14
(2 + 3) * 4     → 20
8 - 3 - 2       → 3
7 / (5 - 5)     → error: division by zero
```

**Entrada**

- Linha 1: `q` (1 ≤ q ≤ 100)
- Depois `q` expressões, uma por linha (até 1.000 caracteres). Os números ficam entre 0 e 1.000.000.000, não há números negativos na entrada, e toda expressão é bem formada. Todo resultado no caminho cabe num `long`.

**Saída**

Uma linha por expressão: o valor dela, ou `error: division by zero`.

**Bom saber**

- Aplicar um operador desempilha dois números, o operando da direita primeiro: para `8 - 3` a pilha dá 3, depois 8.
- Antes de empilhar um operador, aplique todo operador da pilha com precedência maior ou igual que não seja um `(`.
- A divisão de `long` por zero lança uma `ArithmeticException`, que você pode capturar para aquela expressão.
- Um analisador recursivo (expressão → termo → fator) também funciona, se preferir.
