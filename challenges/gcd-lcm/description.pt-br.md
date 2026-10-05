# MDC e MMC

O **máximo divisor comum** (MDC) de dois números é o maior número que divide os dois. O **mínimo múltiplo comum** (MMC) é o menor número que os dois dividem. Para `12` e `18`, o MDC é `6` e o MMC é `36`.

Escreva dois métodos, e faça `lcm` **usar** `gcd`:

```java
int gcd(int a, int b)
long lcm(int a, int b)
```

**Entrada**

- Linha 1: `t`, o número de pares
- Depois, `t` linhas com dois inteiros positivos `a b` (até 2.147.483.647)

**Saída**

Para cada par: `GCD = 6, LCM = 36`

**O que você precisa saber**

- O **algoritmo de Euclides** é rápido mesmo com números enormes: `gcd(a, b) = gcd(b, a % b)`, e `gcd(a, 0) = a`.
- `lcm(a, b) = a / gcd(a, b) * b`. O resultado pode não caber em um `int`, então converta para `long` antes de multiplicar: `(long) a / g * b`.
- Um método pode chamar outro. Reaproveitar `gcd` evita escrever a mesma lógica duas vezes.
