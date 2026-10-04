# Count Occurrences

Read `n` numbers into an array, then a **target** number. Print how many times the target appears in the array.

**Input**

- Line 1: an integer `n` (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by spaces
- Line 3: the target integer

**Output**

How many times the target appears.

**Things to know**

- Read all the numbers into the array first, then read the target.
- Go through every element and add 1 to a counter when it matches: `if (numbers[i] == target) count++;`
- If the target never appears, the answer is `0`.
