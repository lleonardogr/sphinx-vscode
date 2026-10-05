# GCD and LCM

The **greatest common divisor** (GCD) of two numbers is the biggest number that divides both. The **least common multiple** (LCM) is the smallest number that both divide. For `12` and `18`, the GCD is `6` and the LCM is `36`.

Write two methods, and make `lcm` **use** `gcd`:

```java
int gcd(int a, int b)
long lcm(int a, int b)
```

**Input**

- Line 1: `t`, the number of pairs
- Then `t` lines with two positive integers `a b` (up to 2,147,483,647)

**Output**

For each pair: `GCD = 6, LCM = 36`

**Things to know**

- **Euclid's algorithm** is fast even for huge numbers: `gcd(a, b) = gcd(b, a % b)`, and `gcd(a, 0) = a`.
- `lcm(a, b) = a / gcd(a, b) * b`. The result may not fit in an `int`, so cast to `long` before multiplying: `(long) a / g * b`.
- One method can call another. Reusing `gcd` avoids writing the same logic twice.
