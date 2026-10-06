## Why it matters

Every number, letter, photo and program in a computer is stored as **bits**. Knowing how much a group of bits can hold explains everyday puzzles: why a Java `int` stops at 2,147,483,647, why colors have 256 shades of red, and why a counter can suddenly jump to a negative number.

## The bit

A **bit** (short for *binary digit*) is the smallest piece of information: it is either **0** or **1**. In the hardware it is a tiny switch, off or on, or a spot on a disk that is magnetised one way or the other.

One bit can only answer a yes-or-no question. To store more, we put bits side by side.

## Every bit doubles the possibilities

With 1 bit there are 2 patterns: `0` and `1`. Add a second bit and each of those patterns can be followed by a 0 or a 1, so there are 4: `00`, `01`, `10`, `11`. A third bit doubles them again, to 8.

![Every extra bit doubles the patterns: 2, 4, 8](bit-patterns.svg)

So **n bits have 2ⁿ patterns**: 2 × 2 × … × 2, n times. If we use the patterns for the numbers 0, 1, 2, …, the **largest number is 2ⁿ − 1**, because we start counting at 0.

| Bits | Patterns (2ⁿ) | Numbers |
|------|---------------|---------|
| 1 | 2 | 0 to 1 |
| 4 | 16 | 0 to 15 |
| 8 | 256 | 0 to 255 |
| 16 | 65,536 | 0 to 65,535 |
| 32 | 4,294,967,296 | 0 to 4,294,967,295 |

Doubling grows very fast. 10 bits already give 1,024 patterns, about a thousand, and every 10 more bits multiply that by about a thousand again: 20 bits give about a million, 30 bits about a billion.

## The byte

Bits are grouped in eights, and a group of **8 bits is a byte**. A byte holds 2⁸ = **256** different values, from 0 to 255. Half a byte, 4 bits, is called a **nibble**, and it is exactly one hexadecimal digit: that is why a byte is always written with two hex digits, like `FF`.

Memory is organised in bytes: each byte has its own address, and file sizes are counted in bytes. A plain-text letter like `A` takes one byte, and a pixel of a photo usually takes three: one byte each for red, green and blue. That is where the 256 shades of each color come from.

## How many bits does a number need?

Turn the question around: to store the number 300, how many bits do you need? 8 bits only reach 255, and 9 bits reach 511, so **300 needs 9 bits**.

A simple way to count them is to **halve the number until it reaches 0**: each halving removes one binary digit. 300 → 150 → 75 → 37 → 18 → 9 → 4 → 2 → 1 → 0 is 9 halvings, so 9 bits. That is the same as writing 300 in binary, `100101100`, and counting its digits.

## Bits in Java

Java gives every whole-number type a fixed size, the same on every computer:

| Type | Bits | Range |
|------|------|-------|
| `byte` | 8 | −128 to 127 |
| `short` | 16 | −32,768 to 32,767 |
| `int` | 32 | about −2.1 billion to 2.1 billion |
| `long` | 64 | about −9.2 × 10¹⁸ to 9.2 × 10¹⁸ |

The ranges are split between negative and positive numbers, so an `int` goes up to 2³¹ − 1 = 2,147,483,647 instead of 2³² − 1. How negative numbers are stored is the topic of a later unit.

When a calculation goes past the largest value, the bits simply **wrap around**. This is called **overflow**, and Java doesn't warn you:

```java
int big = 2_147_483_647;
IO.println(big + 1); // prints -2147483648
```

That is why the challenges in this unit use `long` whenever numbers can get big.

## Summary

- A bit is 0 or 1; a byte is 8 bits.
- n bits have 2ⁿ patterns, so they can count from 0 to 2ⁿ − 1. Every extra bit doubles that.
- The bits a number needs are the times you can halve it before it reaches 0.
- Java's `byte`, `short`, `int` and `long` have 8, 16, 32 and 64 bits; going past the limit wraps around.
