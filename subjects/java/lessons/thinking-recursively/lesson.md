## In short

A **recursive** method calls itself on a smaller version of the problem. It needs a **base case**, small enough to answer directly, and every call must get closer to it.

```java
String binary(int n) {
    if (n < 2) {
        return String.valueOf(n);  // base case: 0 or 1
    }
    return binary(n / 2) + n % 2;  // a smaller problem, then one more digit
}

void main() {
    int n = Integer.parseInt(IO.readln());
    IO.println(n + " in binary is " + binary(n));
}
```

`binary(13)` calls `binary(6)`, which calls `binary(3)`, then `binary(1)`: the base case returns `"1"`, and each call adds its digit on the way back: `1101`.

**Watch out:** without a base case, or with calls that never reach it, the method calls itself until the program stops with a `StackOverflowError`.

<!-- readings -->
