# Divisão segura (try / catch)

Quando algo dá errado enquanto o programa roda, o Java **lança uma exceção**. Se ninguém capturar, o programa para com erro. Um `try` / `catch` deixa você tratar o problema e continuar.

Divida pares de números inteiros. A divisão por zero não pode derrubar o programa:

```
10 / 2 = 5
Cannot divide by zero
-9 / 4 = -2
```

**Entrada**

- Linha 1: `t`, o número de pares
- Depois, `t` linhas com dois inteiros `a b`

**Saída**

`a / b = resultado` (divisão inteira), ou `Cannot divide by zero`.

**O que você precisa saber**

- O código que pode falhar vai em `try { … }`. Se ele lançar uma exceção, o resto do `try` é pulado e o `catch (TipoDaExcecao e) { … }` correspondente roda.
- A divisão inteira por zero lança uma **`ArithmeticException`**.
- Use a exceção em vez de testar `b == 0` você mesmo: esse é o objetivo do desafio.
