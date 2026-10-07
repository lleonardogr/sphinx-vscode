# Ripple-Carry Adder

The processor adds numbers with **full adders**, one per bit. Each one takes two bits **a** and **b** and the **carry** from the column on its right, and produces:

- **sum** = a XOR b XOR carry
- **carry out** = (a AND b) OR (carry AND (a XOR b))

The carry out goes into the next column to the left, so it "ripples" from right to left, just like adding by hand.

```
         a   00000101   (5)
       + b   00000011   (3)
     = sum   00001000   (8)
 carry out   00000111   (what each column passes to its left)
```

Read two 8-bit numbers and add them with gates only.

**Input**

Two lines, each with exactly 8 characters `0` or `1`.

**Output**

Three lines: `Sum: ` and the 8-bit sum, `Carries: ` and the carry out of each column (from the leftmost column to the rightmost), and `Carry out: ` and the final carry, which is 1 when the sum doesn't fit in 8 bits.

**Things to know**

- `bits.charAt(i) - '0'` turns a character into 0 or 1, so you can use `^`, `&` and `|` on it.
- Start at the rightmost column (index 7) with carry 0, and go left.
- Use the gates: converting the bits to a number and adding with `+` isn't allowed here.
