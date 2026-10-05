# Dividir a conta

Um grupo de amigos divide a conta do restaurante e acrescenta a gorjeta. Calcule quanto **cada pessoa** paga. Quando o valor não divide certinho, todo mundo paga o **centavo de cima**, para a conta sempre ficar coberta.

Por exemplo, uma conta de `100.00` com `10`% de gorjeta dá `110.00`; dividida entre `4` pessoas, cada uma paga `27.50`. Uma conta de `10.00` dividida por `3` dá `3.333…`, então cada uma paga `3.34`.

**Entrada**

- Linha 1: a conta, com duas casas decimais (0.01 a 100000.00)
- Linha 2: o número de pessoas (1 a 100)
- Linha 3: a porcentagem de gorjeta, um número inteiro (0 a 30)

**Saída**

```
Each person pays: 27.50
```

**O que você precisa saber**

- Números decimais como `59.90` não ficam exatos em um `double`. Trabalhar com **centavos** inteiros (`long`) evita erros de arredondamento: `Math.round(total * 100)`.
- A divisão inteira arredonda para baixo. Para arredondar para cima, some `divisor - 1` antes de dividir: `(a + b - 1) / b`.
- `(int)` e `(long)` convertem um número para um tipo inteiro, e `Math.round` arredonda para o inteiro mais próximo.
