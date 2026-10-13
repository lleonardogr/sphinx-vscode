# Estatísticas por ponteiros

Uma função em C devolve **um** valor. Quando uma função tem vários resultados, como o mínimo, o máximo e a média de uns dados, quem chama passa os **endereços** de variáveis para guardá-los: são os chamados parâmetros de saída, e a biblioteca padrão está cheia deles (o `scanf` é um).

Escreva

```c
void stats(const int *values, int n, int *min, int *max, double *mean)
```

e use-a para imprimir as estatísticas da entrada, mais quantos valores estão acima da média:

```
4 8 15 16 23   →   Min: 4
                   Max: 23
                   Mean: 13.20
                   Above mean: 3
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 1000)
- Linha 2: `n` inteiros (cabem num `int`)

**Saída**

`Min: `, `Max: `, `Mean: ` com 2 casas, e `Above mean: ` com a quantidade de valores estritamente maiores que a média.

**Coisas para saber**

- `const int *values` promete que `stats` só lê o array.
- Dentro de `stats`, escreva os resultados com `*min = …`. No `main`, passe `&low`, `&high` e `&mean`.
- Some os valores num `long long`: dois valores perto do limite do `int` já estouram um `int`.
