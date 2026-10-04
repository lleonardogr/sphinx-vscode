# Sum Until Zero (do-while)

A **`do-while`** loop runs its body first and checks the condition **after**, so the body always runs at least once:

```java
do {
    // runs at least once
} while (condition);
```

That's perfect for "read values until a stop signal". Read integers, one per line, until a `0` appears. Then print how many numbers came **before** the `0`, and their sum.

**Use a `do-while` loop.**

**Input**

One integer per line. The last line is always `0`, and it can also be the first.

**Output**

```
Count: <how many numbers before the 0>
Sum: <their sum>
```

**Things to know**

- In modern Java, `IO.readln()` reads the next line each time you call it.
