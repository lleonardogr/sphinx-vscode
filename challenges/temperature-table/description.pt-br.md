# Tabela de temperaturas

Imprima uma tabela que converte Celsius para Fahrenheit. Primeiro escreva um método que converte **uma** temperatura:

```java
double toFahrenheit(double celsius)
```

usando `F = C × 9 / 5 + 32`. Depois chame o método em um laço que vai de `start` até `end`, aumentando de `step` em `step`.

Para `0 100 25`:

```
0 C = 32.0 F
25 C = 77.0 F
50 C = 122.0 F
75 C = 167.0 F
100 C = 212.0 F
```

**Entrada**

Uma linha com três inteiros `start end step` (`start ≤ end`, `step ≥ 1`). Pare quando o próximo valor passar de `end`.

**Saída**

Uma linha por temperatura, com uma casa decimal para Fahrenheit.

**O que você precisa saber**

- Métodos deixam o `main` curto: a fórmula fica em um lugar só e o laço só chama o método.
- Um argumento `int` pode ser passado para um parâmetro `double`: o Java converte sozinho.
- `"%d C = %.1f F".formatted(c, f)` formata um inteiro e um decimal com uma casa.
