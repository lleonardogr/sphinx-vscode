# Construtor de BST

Uma **árvore binária de busca** guarda, em cada nó, as chaves menores à esquerda e as maiores à direita. Bancos de dados, sistemas de arquivos e o próprio `TreeMap` do Java são construídos sobre essa ideia. Construa uma inserindo as chaves na ordem dada e depois descreva-a.

Para as chaves `8 3 10 1 6 14 4 7 13` (a árvore do guia de leitura da unidade):

```
in-order: 1 3 4 6 7 8 10 13 14
pre-order: 8 3 1 6 4 7 10 14 13
post-order: 1 4 7 6 3 13 14 10 8
height: 4
leaves: 4
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 1.000)
- Linha 2: `n` inteiros diferentes (−100.000 a 100.000), inseridos nessa ordem

**Saída**

- `in-order: `, `pre-order: ` e `post-order: `, cada um seguido das chaves naquele percurso, separadas por espaços.
- `height: ` e o número de níveis (um nó sozinho tem altura 1).
- `leaves: ` e quantos nós não têm filhos.

**Bom saber**

- Inserir: comece na raiz e vá para a esquerda com uma chave menor ou para a direita com uma maior, até achar um lugar vazio.
- Em ordem (esquerda, nó, direita) lista as chaves de uma BST ordenadas: um bom teste da sua inserção.
- Chaves inseridas em ordem formam uma corrente: a altura então é `n`.
- Nada de `TreeMap`, `TreeSet` ou ordenação: a árvore é o exercício.
