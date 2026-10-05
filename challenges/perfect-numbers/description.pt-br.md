# Números perfeitos

Os **divisores próprios** de um número são todos os divisores dele, menos o próprio número. Os divisores próprios de `12` são `1, 2, 3, 4, 6`, que somam `16`. Compare essa soma com o número:

| Soma dos divisores próprios | O número é |
|-----------------------------|------------|
| igual ao número (`6 = 1 + 2 + 3`) | `perfect` |
| maior que o número (`12 < 16`) | `abundant` |
| menor que o número (`8 > 1 + 2 + 4`) | `deficient` |

Escreva dois métodos, e faça `classify` chamar `sumOfDivisors`:

```java
long sumOfDivisors(long n)
String classify(long n)
```

**Entrada**

- Linha 1: `t`, a quantidade de valores
- Depois, `t` linhas com um número `n` (1 ≤ n ≤ 10¹²)

**Saída**

`12 is abundant` para cada valor.

**O que você precisa saber**

- Os números vão até um trilhão, então testar todo divisor até `n` é lento demais. Divisores vêm em **pares** (`d` e `n / d`), então basta testar `d` enquanto `d * d <= n`.
- Quando `d * d == n` o par é o mesmo número: some uma vez só. O `1` não tem divisores próprios, então a soma dele é `0`.
- **Métodos auxiliares** pequenos como estes deixam um problema difícil mais fácil: cada um faz uma coisa e pode ser testado sozinho.
