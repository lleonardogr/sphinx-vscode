# Cache LRU

Navegadores, bancos de dados e processadores guardam os dados usados recentemente num **cache** pequeno e rápido. Quando ele está cheio e chega algo novo, um cache **LRU** (usado há mais tempo) joga fora o item que não é usado há mais tempo.

Simule um. `get` lê uma chave e `put` guarda um valor sob uma chave; os dois contam como uso da chave:

```
capacidade 2
put 1 10
put 2 20
get 1           10
put 3 30        evicted 2      (2 é o usado há mais tempo: 1 acabou de ser lido)
get 2           miss
get 3           30
get 1           10
                hits=3 misses=1
```

**Entrada**

- Linha 1: a capacidade (1 ≤ capacidade ≤ 1000)
- Depois comandos até o fim da entrada: `put K V` ou `get K`, com chaves de 0 a 9999 e valores inteiros

**Saída**

- `get K`: o valor, ou `miss` quando `K` não está no cache;
- `put K V` não imprime nada, a não ser que acrescente uma chave nova a um cache cheio: aí `evicted K2`, a chave que jogou fora;
- no fim, `hits=H misses=M` para os comandos `get`.

`put` numa chave que já está no cache atualiza o valor (e a usa); ele nunca despeja.

**Coisas para saber**

- Uma **lista duplamente ligada** em ordem de uso faz "mover para a frente" e "remover o último" serem poucas trocas de ponteiros.
- Um array de 10.000 ponteiros, indexado pela chave, acha o nó de uma chave sem procurar.
- Libere cada nó despejado, e o resto no fim.
