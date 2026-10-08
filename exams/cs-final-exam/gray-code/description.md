# Gray Code

A volume knob or a robot wheel reports its position with a ring of contacts, read as bits. With normal binary, going from 3 (`011`) to 4 (`100`) changes **three** bits at once. They never change at exactly the same instant, so for a moment the sensor may read `111` or `000`: a wild jump. **Gray code** numbers the positions so that **only one bit changes** between neighbours.

The list of n-bit Gray codes is built from the (n − 1)-bit list: first the list with `0` in front, then the **same list reversed** with `1` in front.

| Bits | Gray codes, from position 0 |
|---|---|
| 1 | `0` `1` |
| 2 | `00` `01` `11` `10` |
| 3 | `000` `001` `011` `010` `110` `111` `101` `100` |

So with 3 bits the reading `110` means position 4. The list also wraps around: from the last code back to the first, only one bit changes too.

Read a sensor's readings and print the position of each one. Then count the **glitches**: consecutive readings that differ in more than one bit, which a real encoder can't produce. Two equal readings (the knob didn't move) aren't a glitch.

**Input**

Three lines: the number of bits `n` (1 to 16), the count `k` (1 to 20), and `k` readings of `n` bits each, separated by spaces.

**Output**

One line per reading, such as `110 -> 4`, then `Glitches: G`.

**Things to know**

- A list of strings can be built with `ArrayList<String>` or with arrays of size `2^n`.
- `a.charAt(i) != b.charAt(i)` compares two readings bit by bit.
