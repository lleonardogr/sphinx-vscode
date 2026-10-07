# Potência rápida

Bancos on-line e sites seguros dependem de contas como **aⁿ mod m** com expoentes enormes. Multiplicar por `a` uma vez atrás da outra leva **n passos**: com n = 10¹⁸ isso levaria mais de 30 anos, mesmo a um bilhão de passos por segundo.

A **potência rápida** (exponenciação por quadrados) precisa de só um passo por **dígito binário** de n. Ela usa o fato de que a¹³ = a⁸ × a⁴ × a¹, porque 13 é `1101` em binário, e a², a⁴, a⁸, … saem de elevar ao quadrado de novo e de novo:

```
resultado = 1, base = a
enquanto n > 0:
    se n for ímpar: resultado = resultado × base
    base = base × base
    n = n / 2
```

Tire o `% m` depois de cada multiplicação para os números continuarem pequenos.

**Entrada**

Uma linha com três números inteiros: `a` (0 ≤ a ≤ 10⁹), `n` (0 ≤ n ≤ 10¹⁸) e `m` (1 ≤ m ≤ 10⁹).

**Saída**

Três linhas: `Result: ` e aⁿ mod m, `Fast steps: ` e quantas vezes o laço acima roda, e `Naive steps: ` e n, as multiplicações que o jeito lento precisaria.

**O que você precisa saber**

- O laço roda uma vez por dígito binário de n: cerca de 60 vezes para n = 10¹⁸.
- Com `% m` depois de cada multiplicação, os dois números ficam abaixo de 10⁹, então o produto cabe num `long`.
- a⁰ é 1, então o resultado para n = 0 é `1 % m`.
- Escreva você mesmo: `Math.pow`, `BigInteger` e `modPow` não valem aqui.
