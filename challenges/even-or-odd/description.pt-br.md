# Par ou ímpar

Todo número inteiro é **par** (divide por 2 sem sobrar nada, como 4, 0 e -10) ou **ímpar** (como 7 e -3). Leia um número e imprima `Even` (par) ou `Odd` (ímpar).

**Entrada**

Um inteiro `n` (pode ser negativo).

**Saída**

`Even` ou `Odd`.

**O que você precisa saber**

- `%` dá o resto de uma divisão: `7 % 2` é `1`, e `4 % 2` é `0`.
- Um número é par quando `n % 2 == 0`.
- Com números negativos o resto também é negativo: `-3 % 2` é `-1`. Compare com `0`, não com `1`.
- `if (condição) { … } else { … }` executa exatamente um dos dois blocos.
