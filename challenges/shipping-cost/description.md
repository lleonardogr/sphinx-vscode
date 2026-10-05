# Shipping Cost

An online store calculates shipping from several rules. Apply all of them, in this order.

**1. Check the weight.** A weight of `0` or less prints `Invalid weight`. More than `30` kg prints `Too heavy`. In both cases, stop there.

**2. Base price by weight:**

| Weight | Base price |
|--------|-----------:|
| up to 1 kg | 8.00 |
| more than 1 kg, up to 5 kg | 12.50 |
| more than 5 kg, up to 30 kg | 20.00 |

**3. Distance.** More than `500` km adds **50%** to the price.

**4. Express.** `express` delivery **doubles** the price; `standard` doesn't change it.

**5. Free shipping.** Orders of `200.00` or more ship for free with `standard` delivery (express is never free).

**Input**

- Line 1: the weight in kg (a decimal number)
- Line 2: the distance in km (a whole number)
- Line 3: `standard` or `express`
- Line 4: the order total (a decimal number)

**Output**

`Shipping: 12.50` (two decimal places), `Shipping: free`, `Invalid weight` or `Too heavy`.

**Things to know**

- An `if / else if / else` chain picks the weight band; separate `if` statements apply the extras one after the other.
- Compare Strings with `equals`: `type.equals("express")`.
- `"Shipping: %.2f".formatted(price)` prints two decimals.
