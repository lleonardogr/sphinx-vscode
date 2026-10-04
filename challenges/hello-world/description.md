# Hello, World!

Every Java journey starts here. Write a program that prints exactly:

```
Hello, World!
```

**Things to know**

- `System.out.println(...)` prints text followed by a new line. In Java 25+ you can also write `IO.println(...)`.
- Text (a `String`) goes between double quotes: `"like this"`.
- Java is case-sensitive, and every statement ends with a semicolon `;`.

Both of these programs are accepted:

```java
// Classic Java
public class Main {
    public static void main(String[] args) {
        System.out.println("...");
    }
}
```

```java
// Java 25+ compact source file
void main() {
    IO.println("...");
}
```
