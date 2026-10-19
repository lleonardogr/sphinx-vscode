# Tabela hash

`HashMap` é uma das classes mais usadas do Java, e por baixo é uma ideia simples: um array de **baldes**, uma função hash que escolhe um balde para cada chave e uma lista curta em cada balde para as chaves que colidem. Construa uma você mesmo.

Rode `q` operações numa tabela de chaves e valores inteiros. Cada linha tem três números: uma operação, uma chave e um valor.

- `1 chave valor`: **put**: guarde o valor sob a chave, substituindo um valor antigo.
- `2 chave 0`: **get**: procure a chave.
- `3 chave 0`: **remove**: apague a chave, se ela estiver lá.

No fim, imprima um relatório dos gets (quantos acharam a chave, quantos não acharam e a soma dos valores achados) e quantas chaves a tabela guarda.

Para o exemplo (put 5 → 100, put 7 → 200, get 5, put 5 → 300, get 5, remove 7, get 7):

```
found: 2
missing: 1
sum: 400
size: 1
```

**Entrada**

- Linha 1: `q` (1 ≤ q ≤ 200.000)
- Depois `q` linhas com a operação (1, 2 ou 3), a chave (0 a 1.000.000.000) e o valor (0 a 1.000.000; ignorado por get e remove)

**Saída**

Quatro linhas: `found: `, `missing: `, `sum: ` (o total dos valores achados pelos gets) e `size: ` (as chaves na tabela no fim).

**Bom saber**

- Nada de maps ou sets do `java.util`: arrays, e sua própria classe de nó ou arrays paralelos.
- Uma lista de pares percorrida desde o começo é O(q) por operação: lento demais para 200.000 operações.
- Mantenha os baldes curtos dobrando o array quando ele ficar uns 3/4 cheio.
- A soma pode passar do limite do `int`: use `long`.
