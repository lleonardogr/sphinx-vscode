# Bits Needed

Read a whole number and print how many **bits** it takes to write it in binary, and how many **bytes** that is.

255 is `11111111` in binary: **8** bits, which fit in **1** byte. 256 is `100000000`: **9** bits, so it needs **2** bytes. Each bit you add doubles how far you can count.

**Input**

A whole number `n` (0 ≤ n ≤ 10¹⁸).

**Output**

Two lines: `Bits: ` followed by the number of bits, and `Bytes: ` followed by the number of whole bytes needed for those bits.

**Things to know**

- Each division by 2 removes one binary digit, so the number of times you can halve `n` before it reaches 0 is its number of bits. Zero is written as `0`: 1 bit.
- A byte is 8 bits. To round a division up, add 7 before dividing: `(bits + 7) / 8`.
- Read `n` as a `long`: 10¹⁸ doesn't fit in an `int`.
