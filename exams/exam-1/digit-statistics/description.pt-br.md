# Estatísticas dos dígitos

Leia um número inteiro e mostre informações sobre os dígitos dele:

```
Digits: 5
Sum: 18
Largest: 7
Even digits: 3
```

Essa é a saída para `40725`: ele tem 5 dígitos, que somam `18`, o maior é `7`, e três deles (`4`, `0`, `2`) são pares.

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 10¹⁸).

**Saída**

As quatro linhas acima.

**O que você precisa saber**

- `n % 10` é o último dígito e `n / 10` o remove. Repita até o número acabar.
- O número pode não caber em um `int`: use `long` e `Long.parseLong`.
- `0` tem um dígito, `0`, que é par.
- Resolva com aritmética, sem transformar o número em String.
