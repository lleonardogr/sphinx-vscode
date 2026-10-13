# Multiplicação de matrizes

Gráficos, aprendizado de máquina e simulações físicas passam boa parte do tempo multiplicando matrizes. Os tamanhos vêm com os dados, então o programa não pode conhecê-los quando é escrito: as matrizes precisam ser **alocadas durante a execução**.

O produto de uma matriz A `r × k` por uma matriz B `k × c` é a matriz `r × c` cujo elemento (i, j) é

```
A[i][0]·B[0][j] + A[i][1]·B[1][j] + … + A[i][k−1]·B[k−1][j]
```

O produto pode ser grande, então imprima o tamanho, a soma de todos os elementos e o maior elemento:

```
A = 1 2 3     B = 7  8      A×B =  58  64
    4 5 6         9 10             139 154
                 11 12

→  Size: 2 x 2
   Sum: 415
   Largest: 154
```

**Entrada**

- Linha 1: `r`, `k` e `c` (cada um de 1 a 300)
- Depois A, `r` linhas de `k` inteiros, e B, `k` linhas de `c` inteiros, cada um de −100 a 100

**Saída**

`Size: r x c`, `Sum: ` e `Largest: `.

**Coisas para saber**

- Um array de ponteiros para linhas funciona como um array 2D: `int **a = malloc(r * sizeof *a);` e depois `a[i] = malloc(k * sizeof *a[i]);` para cada linha.
- Um elemento pode chegar a 300 × 100 × 100 = 3.000.000 e a soma a 2,7 × 10¹¹: use `long long`.
- Libere cada linha e cada array de ponteiros.
- Arrays de tamanho fixo não são permitidos: dimensione tudo pela entrada.
