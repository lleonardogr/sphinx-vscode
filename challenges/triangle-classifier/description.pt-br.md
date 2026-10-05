# Classificador de triângulos

Leia o comprimento de três lados e diga que tipo de triângulo eles formam:

| Lados | Imprima |
|-------|---------|
| não forma triângulo (veja abaixo) | `Not a triangle` |
| os três iguais | `Equilateral` |
| exatamente dois iguais | `Isosceles` |
| todos diferentes | `Scalene` |

Três comprimentos só formam um triângulo quando **todo lado é maior que 0** e **cada lado é menor que a soma dos outros dois**. Então `1 2 3` não é triângulo (os lados ficam deitados), mas `3 4 5` é.

**Entrada**

Uma linha com três inteiros `a b c`.

**Saída**

Um de `Not a triangle`, `Equilateral`, `Isosceles` ou `Scalene`.

**O que você precisa saber**

- Teste o "não é triângulo" primeiro, para os outros testes só verem triângulos de verdade.
- `&&` (e) e `||` (ou) combinam condições: `a < b + c && b < a + c && c < a + b`.
- Triângulos equiláteros também têm dois lados iguais, então teste os três lados iguais antes dos dois.
