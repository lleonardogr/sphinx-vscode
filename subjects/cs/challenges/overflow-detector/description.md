# Overflow Detector

An `int` has 32 bits, so it holds numbers from **−2,147,483,648** to **2,147,483,647**. When a calculation goes past that, Java doesn't complain: the bits wrap around and `2147483647 + 1` gives `-2147483648`. This is called **overflow**.

Read a calculation with two `int` values and print its result, or `Overflow` if the real result doesn't fit in an `int`.

**Input**

One line: a number, a space, an operator (`+`, `-` or `*`), a space and another number. Both numbers fit in an `int`.

**Output**

The result, or `Overflow`.

**Things to know**

- A `long` has 64 bits, so the result of any two `int` values fits in it. Calculate with `long`, then compare with `Integer.MIN_VALUE` and `Integer.MAX_VALUE`.
- Convert **before** calculating: `(long) a * b` multiplies as `long`, but `(long) (a * b)` overflows first.
- Detect it yourself: `Math.addExact`, `Math.multiplyExact` and `BigInteger` aren't allowed here.
