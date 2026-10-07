# Read a Signed Byte

Read 8 bits that store a number in **two's complement** and print the number.

The leftmost bit is the **sign**: in two's complement it is worth **−128** instead of +128, and the other bits keep their usual place values. So `11111011` is −128 + 64 + 32 + 16 + 8 + 2 + 1 = **−5**, and `00000101` is **5**.

**Input**

Exactly 8 characters, each `0` or `1`.

**Output**

The number they store, from −128 to 127.

**Things to know**

- Place values in a signed byte: −128, 64, 32, 16, 8, 4, 2, 1.
- `bits.charAt(i)` gives the `i`-th character; compare it with `'1'`.
- Read the bits yourself: `Integer.parseInt(bits, 2)` isn't allowed here.
