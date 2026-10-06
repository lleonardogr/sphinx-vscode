## Why hexadecimal exists

Binary is what the computer uses, but it is long and easy to misread: the number 200 is `11001000`. Programmers needed a shorter way to write the same bits, and **hexadecimal** (base 16, "hex" for short) is it. Each hex digit stands for **exactly 4 bits**, so a byte (8 bits) is always **two** hex digits.

You will see hex everywhere:

- **Colors** on the web: `#FF8800` is red 255, green 136, blue 0.
- **Memory addresses** and byte values in error messages: `0x7F`.
- **Unicode** characters: `U+00E9` is "é".

## The 16 digits

Base 16 needs 16 digits, but we only have ten (0 to 9). So hex borrows letters: **A = 10, B = 11, C = 12, D = 13, E = 14, F = 15**. Upper or lower case mean the same.

| Hex | Decimal | Binary | | Hex | Decimal | Binary |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0000 | | 8 | 8 | 1000 |
| 1 | 1 | 0001 | | 9 | 9 | 1001 |
| 2 | 2 | 0010 | | A | 10 | 1010 |
| 3 | 3 | 0011 | | B | 11 | 1011 |
| 4 | 4 | 0100 | | C | 12 | 1100 |
| 5 | 5 | 0101 | | D | 13 | 1101 |
| 6 | 6 | 0110 | | E | 14 | 1110 |
| 7 | 7 | 0111 | | F | 15 | 1111 |

A group of 4 bits is called a **nibble**: half a byte.

## Hex to decimal

Place values work as always, now with powers of 16: 1, 16, 256, 4096…

- **2F₁₆** = 2 × 16 + 15 × 1 = 32 + 15 = **47**
- **1A3₁₆** = 1 × 256 + 10 × 16 + 3 × 1 = 256 + 160 + 3 = **419**
- **FF₁₆** = 15 × 16 + 15 = **255**, the largest value of one byte

## Binary and hex: groups of four

Converting between binary and hex is easy because 16 = 2⁴. **Split the bits into groups of 4, starting from the right**, and replace each group with its hex digit:

- `1011 0010` → B and 2 → **B2₁₆**
- `11 1110` → pad on the left: `0011 1110` → **3E₁₆**

And back: each hex digit becomes 4 bits. `C4₁₆` → `1100 0100`.

## Decimal to hex

Divide by 16 repeatedly and read the remainders from the last to the first, as you did with 2. Remainders from 10 to 15 become A to F:

| Division | Quotient | Remainder |
|:---:|:---:|:---:|
| 419 ÷ 16 | 26 | **3** |
| 26 ÷ 16 | 1 | **10 → A** |
| 1 ÷ 16 | 0 | **1** |

Read upward: 419 = **1A3₁₆**.

## Octal: base 8

Octal uses the digits 0 to 7, and each digit stands for **3 bits**. It is less common today, but you still meet it in **Unix file permissions**: `chmod 755` means rwx (7 = 111), r-x (5 = 101), r-x (5 = 101).

## Common mistakes

- **Reading `0x10` as ten.** It is 16: one sixteen and zero ones.
- **Grouping bits from the left.** Always group from the right, and pad the leftmost group with zeros.
- **Leading zeros in Java.** In Java, a number that starts with `0` is **octal**: `int x = 010;` stores 8, not 10. Never pad decimal numbers with zeros in code.

## In Java

```java
int color = 0xFF8800;      // hex literal
int mode = 0755;           // octal literal (leading zero!)
IO.println(0x2F);          // 47
IO.println(Integer.toHexString(255)); // ff
```

`System.out.printf("%X", 255)` prints `FF`. In the challenges you'll write these conversions yourself.

## Key terms

- **Hexadecimal (hex)**: base 16, digits 0–9 and A–F.
- **Nibble**: 4 bits, one hex digit.
- **Octal**: base 8, digits 0–7, 3 bits per digit.
- **Prefix**: how code marks the base: `0b` binary, `0x` hex, a leading `0` octal in Java.
