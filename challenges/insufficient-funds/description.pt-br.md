# Saldo insuficiente (exceção própria)

Programas podem definir **suas próprias exceções** para descrever problemas com as próprias palavras. Crie `InsufficientFundsException` e faça `Account.withdraw` lançá-la quando a conta não tiver dinheiro suficiente. O saldo não pode mudar quando falhar.

A mensagem da exceção é:

```
Insufficient funds: balance 70, requested 80
```

Comandos: `deposit X` imprime `Deposited X`, `balance` imprime `Balance: B`, e `withdraw X` imprime `Withdrew X` ou `Error:` seguido da mensagem da exceção.

**Entrada**

- Linha 1: `n`, o número de comandos
- Depois, `n` comandos (os valores são 0 ou mais)

**Saída**

Uma linha por comando.

**O que você precisa saber**

- Uma classe de exceção **estende `Exception`**; chamar `super(mensagem)` no construtor define o que `getMessage()` devolve.
- Estender `Exception` deixa a exceção **verificada** (checked): um método que pode lançá-la diz `throws InsufficientFundsException`, e todo mundo que chama precisa capturar (ou declarar também). O compilador confere isso para você.
- Lance **antes** de mudar o saldo, para um saque que falhou deixar a conta como estava.
