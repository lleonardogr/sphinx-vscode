# FizzBuzz

The classic! Print the numbers from 1 to `n`, one per line, but:

- for multiples of **3**, print `Fizz` instead of the number;
- for multiples of **5**, print `Buzz`;
- for multiples of **both 3 and 5**, print `FizzBuzz`.

**Input**

An integer `n` (1 ≤ n ≤ 1000).

**Output**

`n` lines as described.

**Things to know**

- `i % 3 == 0` means "multiple of 3".
- Check the **both** case first (`i % 3 == 0 && i % 5 == 0`, or `i % 15 == 0`): an else-if chain stops at the first true condition.
- Print the number itself only when none of the three cases apply.
