# Maior e menor

Leia `n` números para dentro de um array e imprima o maior e o menor.

**Entrada**

- Linha 1: um inteiro `n`, a quantidade de elementos (1 ≤ n ≤ 100)
- Linha 2: `n` inteiros separados por espaços

**Saída**

```
Max: <maior>
Min: <menor>
```

**O que você precisa saber**

- `int[] numbers = new int[n];` reserva espaço para `n` números, nos índices `0` a `n - 1`.
- Comece os dois acompanhantes no **primeiro elemento**, não em 0: se todos os números forem negativos, o 0 ganharia sem ser do array.
- Um só laço atualiza os dois: `if (x > max) max = x;` e `if (x < min) min = x;`
