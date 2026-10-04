# Even or Odd

Every whole number is either **even** (it divides by 2 with nothing left over, like 4, 0 and -10) or **odd** (like 7 and -3). Read a number and print `Even` or `Odd`.

**Input**

An integer `n` (it can be negative).

**Output**

`Even` or `Odd`.

**Things to know**

- `%` gives the remainder of a division: `7 % 2` is `1`, and `4 % 2` is `0`.
- A number is even when `n % 2 == 0`.
- With negative numbers the remainder is negative too: `-3 % 2` is `-1`. Compare with `0`, not with `1`.
- `if (condition) { … } else { … }` runs exactly one of the two blocks.
