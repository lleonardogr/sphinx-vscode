# Dia da semana

Leia um número de 1 a 7 e imprima o dia da semana correspondente, em inglês, sendo **1 segunda-feira** (`Monday`) e **7 domingo** (`Sunday`).

Para qualquer outro número, imprima `Invalid day`.

**Entrada**

Um inteiro `n`.

**Saída**

`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday` ou `Invalid day`.

Use um `switch` neste desafio.

**O que você precisa saber**

- `switch (n) { case 1: … break; … default: … }` pula direto para o `case` correspondente.
- Sem `break`, a execução continua no próximo case.
- O `default` é executado quando nenhum case combina, então ele trata os números inválidos.
