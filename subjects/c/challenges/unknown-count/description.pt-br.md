# Quantidade desconhecida

Um programa que lê "todos os números" não sabe de antemão quantos são: 5, ou 100.000. Um array fixo ou fica pequeno ou desperdiça memória, então os programas aumentam o armazenamento conforme os dados chegam. É assim que o `ArrayList` do Java e as listas do Python funcionam por dentro: um bloco de memória que **dobra** quando enche.

Leia inteiros até o fim da entrada e imprima quantos são e a **mediana**, o valor do meio depois de ordenar:

```
5 1 4 2 3   →   Count: 5
                Median: 3.0
```

Com uma quantidade par, a mediana é a média dos dois valores do meio: para `10 20 30 40` ela é `25.0`.

**Entrada**

Inteiros entre −10⁶ e 10⁶, separados por espaços e quebras de linha, até o fim da entrada: de nenhum até 100.000 deles.

**Saída**

`Count: ` e quantos números foram lidos; depois, se houve pelo menos um, `Median: ` com 1 casa.

**Coisas para saber**

- `malloc(capacity * sizeof *values)` dá um bloco para `capacity` ints. Quando ele enche, `realloc(values, nova_capacidade * sizeof *values)` dá um maior, mantendo o conteúdo, talvez em outro lugar.
- O `qsort` ordena os números depois que todos chegaram.
- Libere o bloco no fim com `free(values)`.
- Arrays fixos grandes não são permitidos: dimensione a memória pelos dados.
