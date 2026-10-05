# Soma dos dígitos recursiva

Dois métodos recursivos sobre os dígitos de um número:

- `digitSum(n)`: a soma dos dígitos. `digitSum(9875) = 9 + 8 + 7 + 5 = 29`.
- `digitalRoot(n)`: some os dígitos **de novo e de novo** até sobrar um dígito. `9875 → 29 → 11 → 2`.

Para `9875`:

```
Digit sum: 29
Digital root: 2
```

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 10¹⁸).

**Saída**

As duas linhas acima.

**O que você precisa saber**

- A soma dos dígitos de `n` é o último dígito (`n % 10`) mais a soma dos dígitos do resto (`n / 10`). Um número abaixo de 10 é o caso base.
- Um método recursivo pode usar outro: `digitalRoot` chama `digitSum` e depois chama a si mesmo.
- Resolva sem laços e sem transformar o número em String.
