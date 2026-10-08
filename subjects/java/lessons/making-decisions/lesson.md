## In short

`if` runs a block only when its condition is `true`. Conditions compare values with `==`, `!=`, `<`, `<=`, `>` and `>=`, and combine them with `&&` (and), `||` (or) and `!` (not).

```java
void main() {
    int age = Integer.parseInt(IO.readln());
    int day = Integer.parseInt(IO.readln()); // 1 = Monday … 7 = Sunday
    if (age < 12) {
        IO.println("Child ticket");
    } else if (age >= 65 || day == 3) {
        IO.println("Discount ticket");
    } else {
        IO.println("Full ticket");
    }
    String kind = switch (day) {
        case 6, 7 -> "weekend";
        default -> "weekday";
    };
    IO.println(age >= 18 ? "Adult on a " + kind : "Minor on a " + kind);
}
```

Java tests `if`, then each `else if`, from top to bottom, and runs only the **first** block whose condition is true.

**Watch out:** the order matters. With `if (age >= 18)` before `if (age >= 65)`, the second test is never reached.

<!-- readings -->
