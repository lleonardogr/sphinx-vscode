# Above Average (for-each)

The **enhanced `for` loop**, or **for-each**, visits every element of an array or collection without an index:

```java
for (int number : numbers) {
    // number is each element in turn
}
```

Read a list of numbers, then print their **average** (two decimal places) and how many numbers are **strictly above** the average.

**Use a for-each loop.** You'll need to go through the numbers twice: once for the average, and once to count.

**Input**

- Line 1: the number of values `n` (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by single spaces

**Output**

```
Average: 3.00
Above average: 2
```

**Things to know**

- Storing the values in an array (`int[] numbers = new int[n];`) lets you go through them twice.
- Divide as a `double` to keep the decimals: `(double) sum / n`.
- "Strictly above" means `>`, not `>=`.
- Print two decimals with `"Average: %.2f".formatted(average)`.
