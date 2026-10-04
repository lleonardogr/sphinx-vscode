# Hello, World!

Every Java journey starts here. Write a program that prints exactly:

```
Hello, World!
```

**Things to know**

- `IO.println(...)` prints text followed by a new line. (Classic Java uses `System.out.println(...)`.)
- Text (a `String`) goes between double quotes: `"like this"`.
- Java is case-sensitive, and every statement ends with a semicolon `;`.

Both of these programs are accepted:

```java
// Modern Java (25+)
void main() {
    IO.println("...");
}
```

```java
// Classic Java
public class Main {
    public static void main(String[] args) {
        System.out.println("...");
    }
}
```
