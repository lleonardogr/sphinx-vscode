# Parking Fee

A parking lot charges by the time a car stays:

- up to `30` minutes: **free**
- otherwise: `5.00` for **each started hour** of the whole stay, so 61 minutes is 2 hours
- the fee is never more than `40.00`

**Input**

The number of minutes parked (1 to 1440).

**Output**

`Fee: free`, or the fee with two decimals, such as `Fee: 15.00`.

**Things to know**

- Rounding a division up: `(minutes + 59) / 60`.
- `Math.min(a, b)` returns the smaller value.
- `"Fee: %.2f".formatted(fee)` prints two decimals.
