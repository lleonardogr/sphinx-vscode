# Triângulo de Pascal

Cada número do triângulo de Pascal é a soma dos dois acima dele, e o número na linha `r`, posição `k` é **C(r, k)**: o número de jeitos de escolher `k` coisas entre `r`. A linha `r` tem `r + 1` números, então um array 2D retangular desperdiçaria quase metade da memória. No C dá para alocar um array de **linhas de tamanhos diferentes**: um array de ponteiros, cada um apontando para uma linha do seu tamanho.

```
linha 0:        1
linha 1:       1 1
linha 2:      1 2 1
linha 3:     1 3 3 1
linha 4:    1 4 6 4 1      C(4,2) = 6
```

Monte as primeiras `n` linhas e responda perguntas sobre elas:

```
5 3          Stored: 15
4 2     →    C(4,2) = 6
0 0          C(0,0) = 1
3 1          C(3,1) = 3
```

**Entrada**

- Linha 1: `n`, o número de linhas (1 ≤ n ≤ 67), e `q`, o número de perguntas (1 ≤ q ≤ 100)
- Depois `q` linhas com `r` e `k` (0 ≤ k ≤ r < n)

**Saída**

`Stored: ` e quantos números o triângulo guarda, `n(n + 1)/2`, e depois `C(r,k) = ` e o valor para cada pergunta.

**Coisas para saber**

- `long long **rows = malloc(n * sizeof *rows);` dá `n` ponteiros para linhas; `rows[r] = malloc((r + 1) * sizeof *rows[r]);` dá a linha `r`.
- Aí `rows[r][k]` funciona como num array 2D.
- Todo `malloc` precisa do seu `free`: cada linha, e depois o array de ponteiros.
- A linha 66 guarda C(66, 33) ≈ 7,2 × 10¹⁸, que ainda cabe num `long long`.
