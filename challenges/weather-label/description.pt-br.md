# Rótulo do clima (ternário)

O **operador ternário** escolhe um entre dois valores em uma única expressão:

```java
String resultado = condicao ? valorSeVerdadeiro : valorSeFalso;
```

Leia uma temperatura em °C e imprima um rótulo:

| Temperatura | Rótulo |
|-------------|--------|
| acima de 30 | `Hot` |
| abaixo de 10 | `Cold` |
| nos outros casos (10 a 30) | `Mild` |

**Use o operador ternário, sem `if`.** Você pode colocar um ternário dentro do outro.

**Entrada**

Uma temperatura inteira.

**Saída**

`Hot`, `Cold` ou `Mild`.

**O que você precisa saber**

- No Java moderno, `IO.readln()` lê uma linha inteira como `String`, e `Integer.parseInt(...)` transforma em `int`.
