# Insufficient Funds (Custom Exception)

Programs can define **their own exceptions** to describe problems in their own terms. Create `InsufficientFundsException` and make `Account.withdraw` throw it when the account doesn't have enough money. The balance must not change when it fails.

The exception's message is:

```
Insufficient funds: balance 70, requested 80
```

Commands: `deposit X` prints `Deposited X`, `balance` prints `Balance: B`, and `withdraw X` prints `Withdrew X` or `Error:` followed by the exception's message.

**Input**

- Line 1: `n`, the number of commands
- Then `n` commands (amounts are 0 or more)

**Output**

One line per command.

**Things to know**

- An exception class **extends `Exception`**; calling `super(message)` in its constructor sets what `getMessage()` returns.
- Extending `Exception` makes it **checked**: a method that can throw it says `throws InsufficientFundsException`, and every caller must catch it (or declare it too). The compiler checks this for you.
- Throw **before** changing the balance, so a failed withdrawal leaves the account as it was.
