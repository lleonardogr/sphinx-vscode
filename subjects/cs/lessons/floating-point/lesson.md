## Why it matters

Try this in Java:

```java
IO.println(0.1 + 0.2);   // 0.30000000000000004
```

It isn't a bug in Java: every language that uses the standard `double` prints the same. To understand why, we need to see how computers store numbers with a fraction.

## Binary fractions

In decimal, the places after the point are worth tenths, hundredths, thousandths. In binary they are worth **halves**:

| Place | 1st | 2nd | 3rd | 4th | 5th |
|-------|-----|-----|-----|-----|-----|
| Worth | ½ = 0.5 | ¼ = 0.25 | ⅛ = 0.125 | 1/16 = 0.0625 | 1/32 = 0.03125 |

So binary `0.101` is ½ + ⅛ = **0.625**, and `0.11` is ½ + ¼ = **0.75**.

To write a decimal fraction in binary, **double it** again and again. Each time, the whole part (0 or 1) is the next bit. For 0.625: 1.25 gives **1**, keep 0.25; 0.5 gives **0**; 1.0 gives **1**, and nothing is left. So 0.625 = `0.101`.

## Fractions that never end

In decimal, 1/3 never ends: 0.3333… The same happens in binary, but to numbers that look harmless. Doubling 0.1 gives:

0.2 → **0**, 0.4 → **0**, 0.8 → **0**, 1.6 → **1**, 1.2 → **1**, 0.4 → **0**, 0.8 → **0**, 1.6 → **1**, …

The pattern `0011` repeats forever: 0.1 = `0.0001100110011…`. A computer has to stop somewhere, so the 0.1 it stores is very slightly off, and so are 0.2 and 0.3. Adding two slightly-off numbers gives a result that isn't the closest `double` to 0.3. Only fractions whose denominator is a power of 2 (½, ¼, ⅜, …) are exact.

## Floating point

A `double` works like scientific notation, but in binary. It uses 64 bits split into three parts:

| Part | Bits | Meaning |
|------|------|---------|
| Sign | 1 | positive or negative |
| Exponent | 11 | where the point goes (a power of 2) |
| Mantissa | 52 | the significant bits |

For example, 6.5 is `110.1` in binary, or 1.101 × 2²: the mantissa stores `101` and the exponent stores 2. Because the point "floats", the same 64 bits can store 0.000000001 and 9,000,000,000,000 with the same relative precision: about **15 to 16 significant decimal digits**. A `float` has 32 bits and only about 7 digits.

## What this means for your code

- **Don't compare doubles with `==`** after calculating. Check whether they are close enough: `Math.abs(a - b) < 1e-9`.
- **Don't store money in a `double`.** Count cents in a `long` (R$ 19.90 is 1990 cents), or use `BigDecimal`, which stores decimal digits exactly.
- Printing usually hides the error: `IO.println(0.1)` shows `0.1`, because Java prints the shortest decimal that rounds back to the same `double`.

## Summary

- After the binary point, places are worth ½, ¼, ⅛, …; double a fraction to find its bits.
- Many decimal fractions, such as 0.1, repeat forever in binary, so they are stored approximately.
- A `double` stores a sign, an exponent and a 52-bit mantissa: about 15–16 significant digits.
- Compare doubles with a tolerance, and keep money in whole cents.
