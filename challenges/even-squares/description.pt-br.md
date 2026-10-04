# Quadrados dos pares

A **Stream API** processa coleções como um encadeamento de passos, sem laços: *pegue estes números → fique com alguns → transforme → junte o resultado*. Ela é usada em todo lugar no Java moderno e é uma das favoritas em entrevistas de emprego.

Leia uma lista de números e imprima os **quadrados dos números pares**, na ordem original, separados por espaços. Se não houver números pares, imprima `(none)`.

**Resolva sem laços `for` ou `while`.**

**Entrada**

Uma linha de inteiros separados por um espaço.

**Saída**

Os quadrados dos números pares, separados por espaços, ou `(none)`.

**O que você precisa saber**

- `Arrays.stream(line.split(" ")).mapToInt(Integer::parseInt)` transforma a linha em um stream de `int`.
- `.filter(n -> n % 2 == 0)` fica só com os valores para os quais a condição é verdadeira.
- `.map(n -> n * n)` transforma cada valor.
- `.mapToObj(String::valueOf).collect(Collectors.joining(" "))` junta os valores em uma única String.
