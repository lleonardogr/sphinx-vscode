# Binário para decimal

Leia um número escrito em **binário** e imprima o valor dele em **decimal**.

Cada dígito binário vale o dobro do dígito à sua direita. Some os valores das posições dos dígitos que são **1**: `1011` tem 1s nas posições que valem 8, 2 e 1, então vale 8 + 2 + 1 = **11**.

**Entrada**

Um número binário com 1 a 18 dígitos (só `0` e `1`; pode começar com zeros).

**Saída**

O valor dele em decimal.

**O que você precisa saber**

- Os valores das posições no binário são as potências de 2: 1, 2, 4, 8, 16, …, a partir do dígito **mais à direita**.
- Ler os dígitos como um número `long` deixa você usar aritmética: `digits % 10` é o último dígito e `digits / 10` o remove.
- Faça a conversão você mesmo: `Integer.parseInt(texto, 2)` faria isso por você, então não vale aqui.
