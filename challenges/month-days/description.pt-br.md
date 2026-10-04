# Dias do mês (switch como expressão)

Desde o Java 14, o `switch` pode ser uma **expressão** que devolve um valor. As setas nunca "caem" para o próximo case, e um `case` pode listar vários valores:

```java
int pontos = switch (medalha) {
    case "gold" -> 3;
    case "silver", "bronze" -> 1;
    default -> 0;
};
```

Leia o número de um mês e um ano, e imprima quantos dias esse mês tem. Fevereiro tem 29 dias em ano bissexto (divisível por 4 e não por 100, a não ser que também seja por 400) e 28 nos outros. Para um mês fora de 1–12, imprima `Invalid month`.

**Use um switch como expressão, com setas (`case ... ->`).**

**Entrada**

- Linha 1: o mês (um inteiro)
- Linha 2: o ano

**Saída**

O número de dias, ou `Invalid month`.

**O que você precisa saber**

- Cases com seta, como `case 4, 6, 9, 11 -> 30;`, nunca continuam no próximo, então não precisam de `break`.
- Um switch como expressão precisa produzir um valor para qualquer entrada, então ele precisa de um `default ->`.
- A regra do ano bissexto, do desafio anterior: `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`.
