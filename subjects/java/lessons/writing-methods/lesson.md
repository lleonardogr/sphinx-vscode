## In short

A **method** is a named piece of code you can call as often as you like. Its **parameters** are the values it needs; `return` sends the answer back to whoever called it. A `void` method returns nothing: it just does something, such as printing.

```java
double discounted(double price, int percent) {
    return price - price * percent / 100;
}

void printLine(int width) {
    IO.println("-".repeat(width));
}

void main() {
    double price = Double.parseDouble(IO.readln());
    printLine(20);
    IO.println("10% off: " + discounted(price, 10));
    IO.println("25% off: " + discounted(price, 25));
    printLine(20);
}
```

Each method has its own variables: `price` inside `discounted` is a copy of the value it was called with.

**Watch out:** `discounted(price, 10);` alone on a line computes the answer and throws it away. Use the result: print it or store it, as in `double sale = discounted(price, 10);`.

<!-- readings -->
