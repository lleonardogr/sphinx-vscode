# Fast Power

Online banking and secure websites rely on calculations like **aⁿ mod m** with huge exponents. Multiplying by `a` one time after another takes **n steps**: with n = 10¹⁸ that would take more than 30 years even at a billion steps per second.

**Fast power** (exponentiation by squaring) needs only one step per **binary digit** of n. It uses the fact that a¹³ = a⁸ × a⁴ × a¹, because 13 is `1101` in binary, and a², a⁴, a⁸, … come from squaring again and again:

```
result = 1, base = a
while n > 0:
    if n is odd: result = result × base
    base = base × base
    n = n / 2
```

Take `% m` after every multiplication so the numbers stay small.

**Input**

One line with three whole numbers: `a` (0 ≤ a ≤ 10⁹), `n` (0 ≤ n ≤ 10¹⁸) and `m` (1 ≤ m ≤ 10⁹).

**Output**

Three lines: `Result: ` and aⁿ mod m, `Fast steps: ` and how many times the loop above runs, and `Naive steps: ` and n, the multiplications the slow way would need.

**Things to know**

- The loop runs once per binary digit of n: about 60 times for n = 10¹⁸.
- With `% m` after each multiplication, both numbers stay below 10⁹, so their product fits in a `long`.
- a⁰ is 1, so the result for n = 0 is `1 % m`.
- Write it yourself: `Math.pow`, `BigInteger` and `modPow` aren't allowed here.
