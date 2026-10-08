## In short

A **String** is a sequence of characters, numbered from 0. `charAt(i)` gives one `char`, `length()` counts them, `indexOf` finds one, and `substring(start, end)` copies a piece, from `start` up to but **not including** `end`.

```java
void main() {
    String email = IO.readln().trim();
    int at = email.indexOf('@');
    String user = email.substring(0, at);
    String domain = email.substring(at + 1);
    IO.println("User: " + user + " (" + user.length() + " characters)");
    int dots = 0;
    for (int i = 0; i < email.length(); i++) {
        if (email.charAt(i) == '.') {
            dots++;
        }
    }
    IO.println("Dots: " + dots);
    IO.println(domain.toLowerCase().equals("gmail.com") ? "Gmail" : "Other");
}
```

A String never changes: `toUpperCase()` returns a new one. To build text in a loop, append to a `StringBuilder`.

**Watch out:** compare texts with `a.equals(b)`, never `a == b`. Single characters (`char`, in single quotes) do use `==`.

<!-- readings -->
