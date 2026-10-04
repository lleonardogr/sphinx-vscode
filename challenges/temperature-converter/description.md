# Celsius to Fahrenheit

Convert a temperature from Celsius to Fahrenheit using the formula:

```
F = C × 9 / 5 + 32
```

**Input**

A decimal number `C`.

**Output**

Both temperatures with **one** decimal place, in this format:

```
25.0 C = 77.0 F
```

**Things to know**

- `double` variables hold decimals. `Double.parseDouble(text)` turns the line you read into a `double`.
- With two `int`s, `/` drops the decimals: `9 / 5` is `1`. Write `9.0 / 5`, or multiply the `double` first: `celsius * 9 / 5`.
- `"%.1f".formatted(value)` (or `System.out.printf` in classic Java) prints one decimal place.
