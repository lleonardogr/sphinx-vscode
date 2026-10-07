# Parity Bit

Bits can flip on the way: a scratch on a disk, noise on a cable. The simplest protection is a **parity bit**. The sender counts the 1s in the data and adds one more bit so the total is **even**. The receiver counts again: if the total is odd, something went wrong.

13 is `1101`: three 1s, so the parity bit is **1** (3 + 1 = 4, even). If 13 arrives as 9 (`1001`), the receiver counts two 1s, so the parity no longer matches: **error detected**. If two bits flip, though, the count is even again and the error slips through.

Read the number that was sent and the number that arrived, and check them.

**Input**

One line with two whole numbers from 0 to 2,147,483,647: the value sent and the value received.

**Output**

Three lines: `Ones: ` and the number of 1 bits in the value sent, `Parity bit: ` and its even-parity bit, and `Received: OK` if the received value has the same parity, or `Received: error detected` if it doesn't.

**Things to know**

- `n & 1` is the last bit of `n`, and `n >> 1` shifts the bits right, dropping it. Loop while `n > 0`.
- The even-parity bit is `ones % 2`.
- Count the bits yourself: `Integer.bitCount` isn't allowed here.
