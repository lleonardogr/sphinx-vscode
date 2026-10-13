# Relatório de estoque

**Teste: unidades 1 a 4.** Este programa mistura o que você praticou até aqui: ler e dividir linhas, arrays, ordenação, funções e saída alinhada.

Uma pequena loja exporta o estoque em linhas `código,nome,quantidade,preço`. Escreva o relatório que o gerente lê toda manhã: os itens do estoque mais valioso (quantidade × preço) ao menos valioso, um total, e os itens que estão acabando.

Para a entrada abaixo:

```
4
P100,Blue pen,40,1.50
N200,Notebook A5 squared,12,6.90
S300,Stapler,3,15.00
E400,Eraser,4,0.80
```

o relatório é:

```
CODE     NAME                   QTY      VALUE
N200     Notebook A5 squared     12      82.80
P100     Blue pen                40      60.00
S300     Stapler                  3      45.00
E400     Eraser                   4       3.20
Total value: 191.00
Low stock: S300, E400
```

**Entrada**

- Linha 1: `n`, a quantidade de itens (1 ≤ n ≤ 50)
- Depois `n` linhas `código,nome,quantidade,preço`: o código tem de 1 a 8 letras e dígitos, o nome de 1 a 30 caracteres (espaços permitidos, sem vírgulas), a quantidade vai de 0 a 1000 e o preço de 0.01 a 999.99, sempre com 2 casas.

**Saída**

- O cabeçalho e depois uma linha por item impressa com `"%-8s %-20.20s %5d %10.2f"`: código, nome (cortado em 20 caracteres), quantidade, valor. Os itens vão do maior valor para o menor; valores iguais vão pelo código, na ordem do `strcmp`.
- `Total value: ` e a soma dos valores, com 2 casas.
- `Low stock: ` e os códigos dos itens com menos de 5 unidades, na ordem da entrada, separados por `, `, ou `none`.

**Coisas para saber**

- `sscanf(line, "%8[^,],%30[^,],%d,%lf", code, name, &qty, &price)` divide uma linha: `%[^,]` lê tudo até uma vírgula, e o número limita ao tamanho do array.
- Ordene um array de posições em vez dos próprios dados: a ordem da entrada continua disponível para a lista de estoque baixo.
- `qsort` não é permitido aqui: ele precisa de um ponteiro para função, que vem na unidade de ponteiros.
