# Estatísticas com streams

Streams de números já vêm com cálculos prontos. Leia uma lista de números e imprima algumas estatísticas sobre eles.

**Resolva sem laços `for` ou `while`.**

**Entrada**

Uma linha de inteiros separados por um espaço.

**Saída**

```
Count: 6
Sum: 108
Min: 4
Max: 42
Average: 18.00
```

A média tem **duas** casas decimais.

**O que você precisa saber**

- Um `IntStream` tem `.sum()`, `.min()`, `.max()`, `.average()` e `.count()`.
- `.summaryStatistics()` calcula **tudo de uma vez** e devolve um `IntSummaryStatistics` com `getCount()`, `getSum()`, `getMin()`, `getMax()` e `getAverage()`.
- Um stream só pode ser usado uma vez, então o `summaryStatistics()` evita que você monte o stream cinco vezes.
