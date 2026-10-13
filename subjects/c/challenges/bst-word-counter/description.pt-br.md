# Contador de palavras com ABB

Conte quantas vezes cada palavra aparece num texto e liste as palavras em ordem alfabética. Uma **árvore binária de busca** faz as duas coisas: cada nó guarda uma palavra e a contagem dela, palavras menores vão para a subárvore esquerda e maiores para a direita, então achar uma palavra leva tantos passos quanto a altura da árvore, e um percurso em ordem visita as palavras em ordem.

```
the cat and the hat   →   and 1
                          cat 1
                          hat 1
                          the 2
                          Total: 5
                          Distinct: 4
                          Height: 3
```

`the` é a raiz; `cat` vai para a esquerda, depois `and` à esquerda de `cat`, `hat` à direita de `cat`: três níveis.

**Entrada**

Texto até o fim da entrada. Uma palavra é uma sequência de letras `A`–`Z` ou `a`–`z`, comparada em minúsculas; qualquer outro caractere (dígitos, pontuação, espaços) separa palavras. As palavras têm no máximo 50 letras.

**Saída**

Cada palavra diferente e a contagem dela, em ordem alfabética; depois `Total: ` (todas as palavras), `Distinct: ` e `Height: ` (o número de níveis da árvore, 0 para uma árvore vazia), com as palavras inseridas na ordem em que aparecem.

**Coisas para saber**

- Um nó: a palavra, a contagem e os ponteiros `left` e `right`. Um `insert` recursivo que devolve o nó que recebeu (ou um novo) liga os nós novos com elegância.
- Percurso em ordem: subárvore esquerda, o nó, subárvore direita.
- `Don't` são duas palavras, `don` e `t`, porque `'` não é letra.
- Libere todos os nós no fim: libere os filhos antes do nó.
