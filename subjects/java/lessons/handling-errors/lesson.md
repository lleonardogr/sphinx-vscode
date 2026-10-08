## In short

When something goes wrong, Java **throws** an exception, and the program stops unless some code **catches** it. Put the risky code in `try`; a `catch` block runs only when its kind of exception is thrown.

```java
int age(String text) {
    int value = Integer.parseInt(text.trim());
    if (value < 0 || value > 150) {
        throw new IllegalArgumentException("Not a real age: " + value);
    }
    return value;
}

void main() {
    String line = IO.readln();
    try {
        IO.println("Next year: " + (age(line) + 1));
    } catch (NumberFormatException e) {
        IO.println("Not a number: " + line);
    } catch (IllegalArgumentException e) {
        IO.println(e.getMessage());
    }
}
```

Your own exception is a class that `extends Exception` (callers must catch it or declare `throws`) or `extends RuntimeException` (they don't have to).

**Watch out:** put the more specific `catch` first. `NumberFormatException` is a kind of `IllegalArgumentException`, so in the other order the compiler refuses the code.

<!-- readings -->
