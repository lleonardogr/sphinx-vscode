## In short

A program runs its lines from top to bottom. A **variable** is a named box for a value, and its **type** says what fits in it: `int` for whole numbers, `double` for numbers with decimals, `String` for text.

```java
void main() {
    String name = IO.readln();
    int eggs = Integer.parseInt(IO.readln());
    IO.println("Hi, " + name + "!");
    IO.println("Boxes of 6: " + eggs / 6);
    IO.println("Left over: " + eggs % 6);
    IO.println("Half a box: " + 6 / 2.0);
}
```

- `+` adds numbers and joins text.
- `/` between two `int`s keeps only the whole part: `17 / 6` is `2`. `%` gives the remainder: `17 % 6` is `5`.
- `IO.readln()` reads a line as text; `Integer.parseInt` and `Double.parseDouble` turn it into a number.

**Watch out:** `7 / 2` is `3`, not `3.5`. Write `7 / 2.0` when you need the decimals.

<!-- readings -->
