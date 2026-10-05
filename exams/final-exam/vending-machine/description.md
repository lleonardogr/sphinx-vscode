# Vending Machine

Complete `VendingMachine.select`. It sells the product with the given code, using the credit the customer inserted, and **throws a `VendingException`** when it can't:

| Problem (checked in this order) | Message |
|---------------------------------|---------|
| no product has that code | `Unknown product CODE` |
| the product's stock is 0 | `Sold out: NAME` |
| the credit is less than the price | `Insert N more cents` |

When it works, the stock goes down by 1, the credit goes back to 0, and `select` returns the change. When it fails, nothing changes.

In `main`, print `Dispensed NAME, change C` or `Error:` followed by the message. `insert` and `refund` are already handled.

**Input**

- Line 1: `k`; then `k` lines `CODE NAME PRICE STOCK` (prices in cents)
- Then `n`; then `n` commands: `insert CENTS`, `select CODE` or `refund`

**Output**

One line per command.

**Things to know**

- Throwing stops `select` right away, so put every check **before** changing the stock or the credit.
- `VendingException` extends `Exception`, so it is checked: the call must be inside `try` / `catch`.
- `e.getMessage()` returns the message given to the exception's constructor.
