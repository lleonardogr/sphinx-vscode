# Split the Bill

A group of friends shares a restaurant bill and adds a tip. Work out how much **each person** pays. When the amount doesn't divide evenly, everyone pays the **next cent up**, so the bill is always covered.

For example, a bill of `100.00` with a `10`% tip is `110.00`; split between `4` people, each pays `27.50`. A bill of `10.00` split by `3` is `3.333…`, so each pays `3.34`.

**Input**

- Line 1: the bill, with two decimal places (0.01 to 100000.00)
- Line 2: the number of people (1 to 100)
- Line 3: the tip percentage, a whole number (0 to 30)

**Output**

```
Each person pays: 27.50
```

**Things to know**

- Decimal numbers like `59.90` can't be stored exactly in a `double`. Working in whole **cents** (`long`) avoids rounding mistakes: `Math.round(total * 100)`.
- Integer division rounds down. To round up, add `divisor - 1` before dividing: `(a + b - 1) / b`.
- `(int)` and `(long)` cast a number to a whole type, and `Math.round` rounds to the nearest whole number.
