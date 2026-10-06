# Binary Fractions

Read a number between 0 and 1 and write it in **binary**, with up to **12 bits** after the point.

After the binary point the places are worth **½, ¼, ⅛, 1/16, …** So `0.101` in binary is ½ + ⅛ = **0.625**. Some fractions never end in binary: 0.1 is `0.000110011001100…` forever. That's why `0.1 + 0.2` isn't exactly `0.3` in Java.

To find the bits, **double** the number again and again. Each time, the whole part (0 or 1) is the next bit; keep only the fraction and go on. For 0.625: 1.25 → **1**, 0.5 → **0**, 1.0 → **1**, and the fraction is now 0, so the answer is `0.101`.

**Input**

A number `x` with 0 ≤ x < 1, written in decimal with up to 13 digits after the point.

**Output**

`0.` followed by the bits. Stop as soon as the fraction becomes exactly 0. If there are still bits left after 12, print the first 12 followed by `...`. Zero is `0.0`.

**Things to know**

- In a `double`, multiplying by 2 and subtracting 1 are exact, so this finds the bits the computer really stores.
- `x * 2 >= 1` tells you whether the next bit is 1.
- Find the bits yourself: methods that show a double's bits, such as `Double.doubleToLongBits`, aren't allowed here.
