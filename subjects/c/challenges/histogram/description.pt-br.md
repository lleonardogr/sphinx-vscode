# Histograma

Um professor quer ver de relance como foi uma prova: quantas notas ficaram entre 0 e 9, entre 10 e 19, e assim por diante. Um **histograma** responde com uma barra por faixa, e no código é um uso clássico de array: um contador por faixa, e a própria nota decide qual contador sobe.

Leia as notas e imprima uma barra por faixa, e depois a faixa com mais notas:

```
  0-9  |
 10-19 |
 20-29 |
 30-39 |
 40-49 |
 50-59 |*
 60-69 |*
 70-79 |***
 80-89 |*
 90-100|**
Most common: 70-79
```

**Entrada**

- Linha 1: `n`, a quantidade de notas (0 ≤ n ≤ 1000)
- Linha 2: `n` notas inteiras de 0 a 100

**Saída**

Dez linhas, uma por faixa: a faixa escrita com `printf("%3d-%-3d|", menor, maior)` e depois um `*` por nota nela. A última faixa vai de 90 a 100. Depois `Most common: ` e a faixa com mais notas (a menor delas em caso de empate), a não ser que não haja notas.

**Coisas para saber**

- `int counts[10] = {0};` começa todos os contadores em 0.
- `nota / 10` é o índice da faixa, menos para o 100.
- `%-3d` alinha à esquerda em 3 caracteres: `9` vira `9  `.
