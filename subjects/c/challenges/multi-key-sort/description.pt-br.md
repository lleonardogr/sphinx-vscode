# Ordenação por várias chaves

Uma planilha ordena por "nota, maior primeiro, depois nome". O `qsort` do C consegue ordenar qualquer coisa, porque **você** passa para ele um ponteiro para uma função que compara dois elementos: o `qsort` chama essa função de novo e de novo e move os elementos conforme a resposta.

Leia algumas pessoas e uma lista de chaves de ordenação, e imprima as pessoas ordenadas por essas chaves:

```
Ada 36 92          chaves: -score name
Alan 41 88
Grace 85 92        →   Ada 36 92
Linus 54 75            Dennis 70 92
Barbara 79 88          Grace 85 92
Dennis 70 92           Alan 41 88
                       Barbara 79 88
                       Linus 54 75
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 100)
- Depois `n` linhas: um nome (1 a 20 letras), uma idade e uma nota (inteiros de 0 a 1000)
- Última linha: 1 a 3 chaves entre `name`, `age` e `score`, separadas por espaços; um `-` antes de uma chave a ordena em ordem decrescente

**Saída**

As pessoas, uma por linha como `nome idade nota`, ordenadas pela primeira chave, depois pela segunda quando a primeira é igual, e assim por diante. Pessoas iguais em todas as chaves mantêm a ordem da entrada.

**Coisas para saber**

- `qsort(order, n, sizeof order[0], compare)` ordena um array; `compare` recebe dois ponteiros `const void *` para elementos e devolve negativo, 0 ou positivo.
- Ordene um array de posições `0 … n − 1` e guarde os dados em arrays paralelos: a comparação procura as pessoas pela posição. (Structs, numa unidade mais adiante, deixam isso mais arrumado.)
- O `qsort` não mantém sozinho a ordem dos elementos iguais: compare as posições por último.
