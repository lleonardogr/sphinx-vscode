# Calendário do mês

O comando `cal` do Unix imprime um mês como uma grade de semanas. Por trás, ele precisa de três respostas pequenas: o ano é bissexto, quantos dias tem o mês, e em que dia da semana ele começa? Cada uma é uma **função**, e o calendário é montado com elas.

Leia um mês e um ano e imprima o calendário. Para outubro de 2026:

```
October 2026
Su Mo Tu We Th Fr Sa
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

**Entrada**

Uma linha: o mês (1 a 12) e o ano (1753 a 9999).

**Saída**

O nome do mês (em inglês) e o ano, o cabeçalho dos dias da semana e depois uma linha por semana. Cada dia ocupa 2 caracteres (`%2d`), com um espaço entre os dias. A primeira semana começa com três espaços para cada dia antes do dia 1.

**Coisas para saber**

- Escreva estas três funções e monte o calendário com elas:
  - `int is_leap(int year)`: divisível por 4 mas não por 100, ou divisível por 400.
  - `int days_in_month(int month, int year)`
  - `int day_of_week(int day, int month, int year)`: 0 para domingo até 6 para sábado. O **método de Sakamoto** soma `y + y/4 − y/100 + y/400 + t + day`, módulo 7, onde `t` é 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 de janeiro a dezembro, e `y` é o ano menos 1 em janeiro e fevereiro.
- Espaços no fim da linha não importam.
- `<time.h>` não é permitido: a graça é calcular.
