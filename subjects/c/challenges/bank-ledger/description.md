# Bank Ledger

A bank processes a list of transactions against its accounts, and must refuse the ones that would overdraw an account or name one that doesn't exist. An account is a **struct**; the kind of a transaction is an **enum**, so a `switch` can tell deposits, withdrawals and transfers apart by name instead of by magic numbers.

Read the accounts and the transactions, print the result of each transaction, then the final balances:

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

**Input**

- Line 1: `n`, the number of accounts (1 ≤ n ≤ 50); then `n` lines: id, owner (1 to 20 characters, no spaces) and balance
- Then `t`, the number of transactions (1 ≤ t ≤ 100), and `t` lines: `deposit ID AMOUNT`, `withdraw ID AMOUNT` or `transfer FROM TO AMOUNT`

All money is written with 2 decimals, from 0.00 to 999999.99.

**Output**

- For each transaction, `#k ` and `ok`, `rejected: no such account` (an id that doesn't exist, or a transfer to the same account), or `rejected: insufficient funds` (a withdrawal or transfer bigger than the balance).
- Then each account, in input order: id, owner and balance with 2 decimals.

**Things to know**

- Money in cents, as `long` integers: `0.10` is not exact in a `double`. Read an amount with `scanf("%ld.%d", &whole, &cents)`.
- A function that returns `Account *`, a pointer into the array, lets you change the account itself: `a->balance += amount`.
- `double` and `float` are not allowed.
