# Frações

`0.1 + 0.2` não é exatamente `0.3` num `double`, mas `1/10 + 2/10` é exatamente `3/10` como fração. Planilhas, programas de música e sistemas de álgebra guardam frações exatas como um **par de inteiros**, que no C é naturalmente uma `struct`.

Leia operações com frações e imprima cada resultado na forma irredutível:

```
1/2 + 1/3    →   5/6
3/4 * 2/3    →   1/2
5/6 - 1/6    →   2/3
1/2 / 0/5    →   Error: division by zero
```

**Entrada**

Linhas `a/b op c/d` até o fim da entrada, onde `op` é `+`, `-`, `*` ou `/`. Numeradores e denominadores são inteiros de −1000 a 1000; os denominadores nunca são 0.

**Saída**

Para cada linha, o resultado na forma irredutível, com o sinal no numerador: `p/q`, ou só `p` quando o denominador é 1. Dividir por uma fração igual a 0 imprime `Error: division by zero`.

**Coisas para saber**

- `typedef struct { long num, den; } Fraction;` faz de `Fraction` um tipo: funções podem recebê-lo e devolvê-lo, como qualquer valor.
- Forma irredutível: divida os dois pelo máximo divisor comum e mantenha o denominador positivo.
- `scanf("%ld/%ld %c %ld/%ld", …)` lê uma linha inteira; a `/` do formato precisa bater com a entrada.
