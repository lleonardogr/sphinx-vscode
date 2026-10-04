# Conta bancária (encapsulamento)

**Encapsulamento** quer dizer que um objeto protege os próprios dados: o resto do código só pode mudá-los pelos métodos do objeto, que garantem as regras.

Complete a classe `BankAccount`:

- um atributo `private int balance` que começa em `0`
- `boolean deposit(int amount)`: soma o valor e retorna `true`, ou retorna `false` (sem mudar nada) se o valor for zero ou negativo
- `boolean withdraw(int amount)`: tira o valor e retorna `true`, ou retorna `false` (sem mudar nada) se o saldo não for suficiente
- `int getBalance()`: retorna o saldo

O método `main` já está escrito. Ele lê comandos e chama os seus métodos. **Mude só a classe.**

**Entrada**

- Linha 1: a quantidade de comandos `n`
- Próximas `n` linhas: `deposit <valor>`, `withdraw <valor>` ou `balance`

**Saída**

O `main` imprime `Deposited X`, `Withdrew X`, `Insufficient funds`, `Invalid amount` ou `Balance: X` para cada comando.

**O que você precisa saber**

- Atributos `private` só podem ser usados dentro da própria classe, então o `main` precisa passar por `deposit`, `withdraw` e `getBalance`.
- Teste a regra primeiro e faça `return false;` logo quando a operação não for permitida. Senão, mude o saldo e faça `return true;`.
- Retornar um `boolean` deixa o código que chamou o método decidir o que imprimir.
