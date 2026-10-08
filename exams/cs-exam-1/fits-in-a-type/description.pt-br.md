# Cabe em qual tipo

O Java tem quatro tipos de números inteiros, cada um com um número fixo de bits em complemento de dois:

| Tipo | Bits |
|---|---|
| `byte` | 8 |
| `short` | 16 |
| `int` | 32 |
| `long` | 64 |

Escolher o menor tipo que cabe economiza memória em arrays e arquivos grandes. Para cada número, imprima o **menor** tipo que consegue guardá-lo.

Por exemplo, 200 não cabe num `byte` mas cabe num `short`, e −129 também não cabe num `byte`.

**Entrada**

A quantidade `n` (1 a 20), depois `n` linhas, cada uma com um número inteiro que cabe num `long`.

**Saída**

Uma linha por número: o número, dois-pontos, um espaço e o tipo, como `200: short`.

**Para saber**

- Com `b` bits em complemento de dois, o menor valor é −2^(b−1) e o maior 2^(b−1) − 1.
- Leia os números com `Long.parseLong`.
