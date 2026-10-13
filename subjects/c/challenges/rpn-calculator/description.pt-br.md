# Calculadora RPN

Calculadoras HP antigas, a linguagem PostScript e a máquina virtual do Java usam a **Notação Polonesa Reversa**: o operador vem depois dos operandos, então `3 4 +` quer dizer 3 + 4, e nunca são necessários parênteses. Ela é avaliada com uma **pilha**: empilhe os números, e um operador desempilha dois e empilha o resultado.

```
5 1 2 + 4 * + 3 -        5 + (1 + 2) × 4 − 3

empilha 5, 1, 2   → 5 1 2
+                 → 5 3
empilha 4, *      → 5 12
+                 → 17
empilha 3, -      → 14
```

Monte a pilha como uma **lista ligada** de nós do `malloc` e avalie cada linha:

```
3 4 +    →   7
1 +      →   Error: stack underflow
4 0 /    →   Error: division by zero
1 2 3    →   Error: leftover values
```

**Entrada**

Linhas de símbolos separados por espaços, até o fim da entrada: inteiros (talvez negativos, como `-5`) e os operadores `+ - * /`. Todo valor fica entre −10¹⁸ e 10¹⁸.

**Saída**

Para cada linha, o único valor que sobrou na pilha, ou `Error: stack underflow` (um operador com menos de dois valores), `Error: division by zero`, `Error: leftover values` (mais de um valor no fim) ou `Error: empty` (nenhum símbolo). Depois de um erro o resto da linha é ignorado.

**Coisas para saber**

- Um operador desempilha `b` primeiro, depois `a`, e empilha `a op b`: `10 -3 /` é 10 / −3 = −3, arredondando para zero.
- `strtok(line, " \n")` divide uma linha em símbolos; um símbolo que é só `-` é operador, `-5` é número.
- Libere todos os nós: os que você desempilha e os que sobram no fim.
- Arrays de números não são permitidos: a pilha é feita de nós.
