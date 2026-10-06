# Binary to Decimal

Read a number written in **binary** and print its value in **decimal**.

Each binary digit is worth twice the digit to its right. Add up the place values of the digits that are **1**: `1011` has 1s in the places worth 8, 2 and 1, so it is 8 + 2 + 1 = **11**.

**Input**

A binary number with 1 to 18 digits (only `0` and `1`; it may start with zeros).

**Output**

Its value in decimal.

**Things to know**

- The place values in binary are the powers of 2: 1, 2, 4, 8, 16, …, starting from the **rightmost** digit.
- Reading the digits as a `long` number lets you use arithmetic: `digits % 10` is the last digit and `digits / 10` removes it.
- Do the conversion yourself: `Integer.parseInt(text, 2)` would do it for you, so it isn't allowed here.
