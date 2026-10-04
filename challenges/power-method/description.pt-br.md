# Potência (método)

Escreva um método `long power(int base, int exponent)` que retorne `base` elevado a `exponent` (base<sup>exponent</sup>) como `long`, **usando um laço**.

Por exemplo, `power(2, 10)` retorna `1024`, e qualquer número elevado a `0` é `1`.

**Entrada**

Dois inteiros: `base` e `exponent` (0 ≤ exponent ≤ 60, e o resultado sempre cabe em um `long`).

**Saída**

```
<base>^<exponent> = <resultado>
```

**O que você precisa saber**

- Um método declara o tipo que devolve (`long`) e os parâmetros que recebe (`int base, int exponent`).
- Comece com `long result = 1;` e multiplique por `base` uma vez a cada volta do laço, `exponent` vezes.
- `long` guarda resultados até cerca de 9 × 10¹⁸. `Math.pow` devolve um `double` e não é permitido aqui.
