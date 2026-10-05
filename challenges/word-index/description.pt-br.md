# Índice de palavras (flatMap)

O índice no fim de um livro lista cada palavra com as páginas onde ela aparece. Monte um para um texto, em que as "páginas" são números de linha, usando streams e sem laços.

Uma **palavra** é uma sequência de letras, em minúsculas (`The` e `the` são a mesma palavra). Para

```
The cat sat.
A dog and a cat!
the END
```

o índice é

```
a: 2
and: 2
cat: 1, 2
dog: 2
end: 3
sat: 1
the: 1, 3
```

**Entrada**

- Linha 1: `n`, o número de linhas (pelo menos uma tem letra)
- Depois, `n` linhas de texto (podem ser vazias)

**Saída**

Todas as palavras em ordem alfabética, com as linhas onde aparecem (numeradas a partir de 1, em ordem crescente, cada uma uma vez só).

**O que você precisa saber**

- `map` transforma cada elemento em **um** elemento novo; **`flatMap`** transforma cada elemento em um **stream** de elementos e junta todos, que é o que você precisa para ir de linhas para palavras.
- Um pequeno `record Entry(String word, int line)` mantém cada palavra junto do número da linha enquanto o stream anda.
- `Collectors.groupingBy(chave, TreeMap::new, Collectors.mapping(valor, Collectors.toCollection(TreeSet::new)))` agrupa em um mapa ordenado de sets ordenados.
