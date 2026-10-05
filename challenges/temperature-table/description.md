# Temperature Table

Print a table that converts Celsius to Fahrenheit. First write a method that converts **one** temperature:

```java
double toFahrenheit(double celsius)
```

using `F = C × 9 / 5 + 32`. Then call it in a loop that goes from `start` to `end`, increasing by `step`.

For `0 100 25`:

```
0 C = 32.0 F
25 C = 77.0 F
50 C = 122.0 F
75 C = 167.0 F
100 C = 212.0 F
```

**Input**

One line with three integers `start end step` (`start ≤ end`, `step ≥ 1`). Stop when the next value would pass `end`.

**Output**

One row per temperature, with one decimal place for Fahrenheit.

**Things to know**

- Methods keep `main` short: the formula lives in one place and the loop just calls it.
- An `int` argument can be passed to a `double` parameter: Java widens it automatically.
- `"%d C = %.1f F".formatted(c, f)` formats a whole number and a decimal with one place.
