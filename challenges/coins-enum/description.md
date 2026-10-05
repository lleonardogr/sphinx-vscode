# Coins (enum)

An **enum** is a type with a fixed set of values. Give the enum `Coin` a value in cents for each coin, then count a pile of coins:

| Coin | Cents |
|------|------:|
| `PENNY` | 1 |
| `NICKEL` | 5 |
| `DIME` | 10 |
| `QUARTER` | 25 |

For `quarter dime dime penny`:

```
PENNY x1
DIME x2
QUARTER x1
Total: 46 cents
```

**Input**

One line of coin names separated by spaces, in any mix of uppercase and lowercase.

**Output**

- `Unknown coin: name` for each name that isn't a coin, in input order, as it was written
- then one `COIN xN` line for each coin that appeared, in the enum's order (`PENNY` to `QUARTER`)
- then `Total: N cents`

**Things to know**

- Enum constants can have **fields**: write `PENNY(1)` and a constructor `Coin(int cents)` inside the enum.
- `Coin.values()` returns all the constants in order, and `name()` returns a constant's name.
- An `EnumMap<Coin, Integer>` is a map whose keys are enum constants, kept in the enum's order.
