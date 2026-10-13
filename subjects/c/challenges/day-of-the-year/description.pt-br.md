# Dia do ano

Registros, dados científicos e muitos calendários numeram os dias de 1 a 365 (366 no ano bissexto): 1º de março é o dia 60 em 2023 e o dia 61 em 2024. Este exercício usa uma expressão clássica do C: um `switch` cujos cases **caem** um no outro de propósito.

Leia uma data e imprima o número do dia, ou `Invalid date`.

```
1 3 2024   →   Day 61 of 2024
```

Os 31 dias de janeiro mais os 29 de fevereiro (2024 é bissexto) mais 1.

**Entrada**

Uma linha: dia, mês e ano (o ano de 1 a 9999).

**Saída**

`Day N of YYYY`, ou `Invalid date` quando o mês não é de 1 a 12 ou o dia não existe naquele mês.

**Coisas para saber**

- Um ano é bissexto quando é divisível por 4 mas não por 100, ou divisível por 400: 2024 e 2000 são, 1900 e 2023 não.
- Num `switch`, um `case` sem `break` continua no case seguinte. Normalmente é um erro; aqui é o truque: pule para o mês, e cada case abaixo soma um mês anterior.
- Marque cada queda proposital com um comentário `// fall through`: alguns compiladores avisam sobre um `case` sem `break` se não houver.
- Arrays vêm numa unidade mais adiante, então faça sem eles.
