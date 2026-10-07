## Why it matters

Bits are only 0s and 1s: there is no minus sign. Yet Java's `int` holds −5 just as easily as 5. The trick computers use, **two's complement**, also explains why `Integer.MAX_VALUE + 1` suddenly becomes a large negative number.

## A first idea: a sign bit

The simplest idea is to use the leftmost bit as a sign: 0 for positive, 1 for negative. In 8 bits, 5 would be `00000101` and −5 would be `10000101`.

It has two problems. There are two zeros (`00000000` and `10000000`, "minus zero"), and ordinary addition gives wrong answers: `00000101` + `10000101` is `10001010`, which would mean −10, not 0. The hardware would need separate circuits for signed numbers.

## Two's complement

Computers use a cleverer rule. In a byte, the leftmost bit is worth **−128** instead of +128, and every other bit keeps its usual value:

| Bit | 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Worth | −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

So `11111011` is −128 + 64 + 32 + 16 + 8 + 2 + 1 = **−5**, and `10000000` is **−128**. A byte now holds the numbers from **−128 to 127**: there is only one zero, and the leftmost bit still tells you the sign.

## Turning a number negative

To find the bits of −5:

1. Write 5 in binary: `00000101`.
2. **Invert** every bit: `11111010`.
3. **Add 1**: `11111011`.

Another way to see it: a negative number `n` is stored like `n + 256`. −5 is stored like 251, and 251 in binary is `11111011`.

The best part is that addition just works. 5 + (−5) is `00000101` + `11111011` = `1 00000000`: the ninth bit doesn't fit in the byte and is dropped, leaving 0. The same adding circuit handles positive and negative numbers.

## The sizes of Java's types

| Type | Bits | Smallest | Largest |
|------|------|----------|---------|
| `byte` | 8 | −128 | 127 |
| `short` | 16 | −32,768 | 32,767 |
| `int` | 32 | −2,147,483,648 | 2,147,483,647 |
| `long` | 64 | about −9.2 × 10¹⁸ | about 9.2 × 10¹⁸ |

With n bits, the range is −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1: one more negative number than positive, because zero takes one of the "positive" patterns.

## Overflow

When a result needs more bits than the type has, the extra bits are dropped and the number **wraps around**:

```java
int big = Integer.MAX_VALUE;     // 01111111 11111111 11111111 11111111
IO.println(big + 1);             // -2147483648: 10000000 00000000 ...
IO.println((byte) 200);          // -56: 200 doesn't fit in a byte
```

Java gives no error. If numbers can get big, use `long`, or check the result: computing with `long` and comparing with `Integer.MAX_VALUE` tells you whether an `int` result is real.

## Summary

- Two's complement makes the leftmost bit negative: in a byte it is worth −128.
- To negate a number, invert all its bits and add 1.
- A byte holds −128 to 127; n bits hold −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1.
- Results that don't fit wrap around silently: this is overflow.
