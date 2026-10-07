# IP Address to Number

The dots in an IP address are only for people. To the computer, an IPv4 address is **one 32-bit number**: the 4 parts are its 4 bytes. `192.168.1.1` is the bytes 192, 168, 1 and 1, which is the number

192 × 256³ + 168 × 256² + 1 × 256 + 1 = **3,232,235,777**.

Read a valid IPv4 address and print it as a number and as 32 bits.

**Input**

A valid IPv4 address.

**Output**

Two lines: `Number: ` and the address as a number, and `Binary: ` and its 4 bytes as 8 bits each, separated by dots.

**Things to know**

- Treat the parts like digits in base 256: `value = value * 256 + part` for each part, in order.
- Use `long`: from 128.0.0.0 up the number doesn't fit in an `int`.
- Each byte must be written with exactly 8 bits, so 1 becomes `00000001`.
