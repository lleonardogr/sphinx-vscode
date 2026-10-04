# Reverse an Array

Read `n` numbers into an array and print them in **reverse order**, on one line, separated by spaces.

**Input**

- Line 1: an integer `n`, the number of elements (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by spaces

**Output**

The numbers from last to first, separated by single spaces. (A trailing space at the end is OK.)

**Things to know**

- `numbers.length` is the size of the array, so the last element is `numbers[numbers.length - 1]`.
- A loop can count down: `for (int i = numbers.length - 1; i >= 0; i--)`.
- Print on one line with `IO.print(numbers[i] + " ")`, then finish with `IO.println()`.
