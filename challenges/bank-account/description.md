# Bank Account (Encapsulation)

**Encapsulation** means an object protects its own data: other code can only change it through the object's methods, which enforce the rules.

Complete the class `BankAccount`:

- a `private int balance` field that starts at `0`
- `boolean deposit(int amount)`: adds the amount and returns `true`, or returns `false` (changing nothing) if the amount is zero or negative
- `boolean withdraw(int amount)`: removes the amount and returns `true`, or returns `false` (changing nothing) if the balance is too small
- `int getBalance()`: returns the balance

The `main` method is already written. It reads commands and calls your methods. **Only change the class.**

**Input**

- Line 1: the number of commands `n`
- Next `n` lines: `deposit <amount>`, `withdraw <amount>` or `balance`

**Output**

`main` prints `Deposited X`, `Withdrew X`, `Insufficient funds`, `Invalid amount` or `Balance: X` for each command.
