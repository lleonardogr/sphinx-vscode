# Weather Label (Ternary)

The **ternary operator** picks one of two values in a single expression:

```java
String result = condition ? valueIfTrue : valueIfFalse;
```

Read a temperature in °C and print a label:

| Temperature | Label |
|-------------|-------|
| above 30 | `Hot` |
| below 10 | `Cold` |
| otherwise (10 to 30) | `Mild` |

**Use the ternary operator, without `if`.** You can nest one ternary inside another.

**Input**

An integer temperature.

**Output**

`Hot`, `Cold` or `Mild`.

**Things to know**

- In modern Java, `IO.readln()` reads a whole line as a `String`, and `Integer.parseInt(...)` turns it into an `int`.
