# Livro-caixa do banco

Um banco processa uma lista de transações nas suas contas, e precisa recusar as que deixariam uma conta negativa ou citam uma que não existe. Uma conta é uma **struct**; o tipo de uma transação é um **enum**, então um `switch` consegue separar depósitos, saques e transferências por nome, e não por números mágicos.

Leia as contas e as transações, imprima o resultado de cada transação e depois os saldos finais:

```
3                             #1 ok
101 Ada 100.00                #2 rejected: insufficient funds
102 Alan 25.50                #3 ok
103 Grace 0.00                #4 rejected: no such account
5                             #5 ok
deposit 103 10.25             101 Ada 60.00
withdraw 102 30.00            102 Alan 0.00
transfer 101 102 40.00        103 Grace 10.25
transfer 101 999 1.00
withdraw 102 65.50
```

**Entrada**

- Linha 1: `n`, a quantidade de contas (1 ≤ n ≤ 50); depois `n` linhas: id, titular (1 a 20 caracteres, sem espaços) e saldo
- Depois `t`, a quantidade de transações (1 ≤ t ≤ 100), e `t` linhas: `deposit ID VALOR`, `withdraw ID VALOR` ou `transfer ORIGEM DESTINO VALOR`

Todo dinheiro é escrito com 2 casas, de 0.00 a 999999.99.

**Saída**

- Para cada transação, `#k ` e `ok`, `rejected: no such account` (um id que não existe, ou uma transferência para a mesma conta), ou `rejected: insufficient funds` (um saque ou transferência maior que o saldo).
- Depois cada conta, na ordem da entrada: id, titular e saldo com 2 casas.

**Coisas para saber**

- Dinheiro em centavos, como inteiros `long`: `0.10` não é exato num `double`. Leia um valor com `scanf("%ld.%d", &inteiro, &centavos)`.
- Uma função que devolve `Account *`, um ponteiro para dentro do array, permite mudar a própria conta: `a->balance += amount`.
- `double` e `float` não são permitidos.
