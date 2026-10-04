# Soma dos dígitos

Leia um número não negativo e imprima a soma dos seus dígitos. Por exemplo, para `1234` a resposta é `1 + 2 + 3 + 4 = 10`.

Resolva com **matemática**, não com Strings:

- `n % 10` dá o último dígito (`1234 % 10` é `4`);
- `n / 10` remove o último dígito (`1234 / 10` é `123`).

**Entrada**

Um inteiro `n` (0 ≤ n ≤ 2.000.000.000).

**Saída**

A soma dos dígitos de `n`.

**O que você precisa saber**

- Um laço `while (n > 0)` repete até não sobrar nenhum dígito.
- `sum += n % 10;` e depois `n /= 10;` tratam um dígito por volta.
- Para `0`, o laço nunca roda e a soma continua `0`.
