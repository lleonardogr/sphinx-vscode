# Tempo de CPU

Um processador trabalha no ritmo de um **clock**. Cada batida é um **ciclo**, e um processador de 3 GHz bate 3 bilhões de vezes por segundo. Cada instrução leva alguns ciclos: a média é o **CPI** (ciclos por instrução).

Então o tempo de execução de um programa é:

> ciclos = instruções × CPI
> tempo = ciclos ÷ frequência do clock

Um programa de 1.500.000 instruções com CPI 2 precisa de 3.000.000 de ciclos; a 3 GHz isso leva 3.000.000 ÷ 3.000.000.000 = 0,001 segundo = **1 milissegundo**.

**Entrada**

Uma linha: a frequência do clock em GHz (um número, talvez com casas decimais, com ponto), o CPI (um número inteiro de 1 a 20) e o número de instruções (um número inteiro até 10¹²).

**Saída**

Duas linhas: `Cycles: ` e o número de ciclos, e `Time: ` e o tempo em milissegundos com 3 casas decimais, seguido de ` ms`.

**O que você precisa saber**

- 1 GHz são 1.000.000.000 de ciclos por segundo, então um clock de `g` GHz dá `g * 1e9` ciclos por segundo.
- Guarde os ciclos num `long`: 10¹² instruções não cabem num `int`.
- `String.format("%.3f", x)` arredonda para 3 casas decimais.
