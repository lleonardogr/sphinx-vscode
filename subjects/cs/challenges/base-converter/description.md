# Base Converter

Programmers switch bases all the time: binary for bits, hex for bytes, and base 36 for short codes such as the ones in shortened links.

Convert a number from **any base to any base**, from 2 to 36. Digits go from `0` to `9` and then `A` (10) to `Z` (35), so base 16 uses `0`–`F` and base 36 uses `0`–`Z`. Letters may be typed in upper or lower case.

For example, `255 10 16` converts 255 from base 10 to base 16: **FF**.

Check the input in this order:

1. If a base is outside 2 to 36, print `Invalid base`.
2. If a digit isn't valid in the source base, print `Invalid digit X for base B`, with the **first** invalid digit as it was typed (in base 10, `A` isn't a digit).
3. Otherwise print the number in the target base, with uppercase letters.

**Input**

One line: the number, the source base and the target base, separated by spaces. The number's value is at most 9,223,372,036,854,775,807 (the largest `long`).

**Output**

The converted number, `Invalid base`, or `Invalid digit X for base B`.

**Things to know**

- Going **through a `long`** keeps it simple: convert from the source base to a value, then from the value to the target base. Two methods, one for each direction.
- From base b to a value: `value = value * b + digit`, left to right. From a value to base b: repeated division by `b`, reading the remainders from the last to the first.
- One `String` of 36 digits works as a table in both directions: `indexOf` gives a digit's value and `charAt` gives the digit of a value. Write the conversions yourself, without `Long.parseLong(text, base)`, `Long.toString(value, base)` or `Character.digit`.
