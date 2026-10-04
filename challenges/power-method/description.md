# Power (Method)

Write a method `long power(int base, int exponent)` that returns `base` raised to `exponent` (base<sup>exponent</sup>) as a `long`, **using a loop**.

For example, `power(2, 10)` returns `1024`, and anything raised to `0` is `1`.

**Input**

Two integers: `base` and `exponent` (0 ≤ exponent ≤ 60, and the result always fits in a `long`).

**Output**

```
<base>^<exponent> = <result>
```

**Things to know**

- A method declares the type it returns (`long`) and the parameters it takes (`int base, int exponent`).
- Start with `long result = 1;` and multiply by `base` once per turn of the loop, `exponent` times.
- `long` holds results up to about 9 × 10¹⁸. `Math.pow` returns a `double` and isn't allowed here.
