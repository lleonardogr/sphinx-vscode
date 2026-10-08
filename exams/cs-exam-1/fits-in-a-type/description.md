# Fits in a Type

Java has four whole-number types, each with a fixed number of bits in two's complement:

| Type | Bits |
|---|---|
| `byte` | 8 |
| `short` | 16 |
| `int` | 32 |
| `long` | 64 |

Choosing the smallest type that fits saves memory in big arrays and files. For each number, print the **smallest** type that can hold it.

For example, 200 doesn't fit in a `byte` but fits in a `short`, and −129 doesn't fit in a `byte` either.

**Input**

The count `n` (1 to 20), then `n` lines, each with a whole number that fits in a `long`.

**Output**

One line per number: the number, a colon, a space and the type, such as `200: short`.

**Things to know**

- With `b` bits in two's complement, the smallest value is −2^(b−1) and the largest 2^(b−1) − 1.
- Read the numbers with `Long.parseLong`.
