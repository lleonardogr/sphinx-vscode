# Formas de dar troco

De quantas formas diferentes um caixa pode montar 1 dólar com moedas de 50, 25, 10, 5 e 1 centavos? Contar uma por uma não dá, mas a **recursão** divide a pergunta em cópias menores dela mesma: toda forma ou usa uma moeda de 50 centavos, e aí ainda precisa montar 50 centavos, ou nunca usa, e monta 1 dólar com as moedas menores.

Leia um valor em centavos e imprima de quantas formas ele pode ser montado, sem importar a ordem das moedas. Para 11 centavos são 4:

```
10 + 1        5 + 5 + 1        5 + 1 + 1 + 1 + 1 + 1        onze moedas de 1
```

**Entrada**

Um número inteiro: o valor em centavos (0 ≤ valor ≤ 300).

**Saída**

O número de formas.

**Coisas para saber**

- Uma função `ways(amount, k)` que conta as formas usando só as moedas da k-ésima em diante basta: ou use a moeda k mais uma vez, ou passe para a moeda k + 1.
- O valor 0 tem exatamente uma forma: nenhuma moeda.
- Resolva sem laços: a recursão faz a contagem.
