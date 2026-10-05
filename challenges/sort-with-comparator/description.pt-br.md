# Ordenar com Comparator (lambdas)

Uma **lambda** é uma funçãozinha que você passa adiante como se fosse um valor: `(a, b) -> a - b`. Um uso muito comum é dizer ao `sort` **como** comparar dois elementos.

Leia pessoas no formato `nome:idade` e imprima em duas ordens:

1. **Pela idade**, do mais novo para o mais velho; mesma idade, ordem alfabética.
2. **Pelo tamanho do nome**, do maior para o menor; mesmo tamanho, ordem alfabética.

Para `ana:19 bruno:17 carla:19 di:17`:

```
By age:
  17 bruno
  17 di
  19 ana
  19 carla
By name length:
  bruno
  carla
  ana
  di
```

**Entrada**

Uma linha de entradas `nome:idade` separadas por espaços (nomes em minúsculas).

**Saída**

Como acima, com dois espaços antes de cada entrada.

**O que você precisa saber**

- `list.sort(comparador)` ordena a lista no lugar. Um **Comparator** devolve um número negativo quando `a` vem primeiro, positivo quando `b` vem primeiro, e 0 no empate.
- `Comparator.comparingInt(Person::age)` monta um comparador a partir de uma chave; `.thenComparing(...)` desempata e `.reversed()` inverte a ordem.
- `Person::age` é uma **referência de método**, um jeito mais curto de escrever a lambda `p -> p.age()`.
