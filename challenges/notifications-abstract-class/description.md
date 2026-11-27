# Notifications (Abstract Class)

An app sends the same kind of message through three channels. The common part, the line that says where the message goes, is written once in an **abstract class**; each channel decides only how to shape the text.

Write an abstract class `Notification`:

- a `private final` field with the recipient, set by its constructor;
- `abstract String channel()`: `EMAIL`, `SMS` or `PUSH`;
- `abstract String format(String text)`: how the channel shapes the text;
- `String send(String text)`, written **once** in `Notification`, which returns `CHANNEL to RECIPIENT: formatted text`.

Then write three subclasses:

| Class | channel() | format(text) |
|---|---|---|
| `Email` | `EMAIL` | the text as it is |
| `Sms` | `SMS` | the text if it has at most 16 characters; otherwise its first 13 characters followed by `...` |
| `Push` | `PUSH` | the text in upper case |

**Input**

- Line 1: the number of notifications `n`
- Then `n` lines: a type (`email`, `sms` or `push`), a recipient (no spaces), and the text (the rest of the line)

**Output**

What `send` returns for each notification, in order:

```
EMAIL to ana@example.org: Your order has shipped
SMS to +5511999990000: Your code: 4821
PUSH to bia: MEETING AT 3PM
```

**Things to know**

- `abstract class Notification` can't be created with `new Notification(...)`, but `new Email(...)` works, and a `Notification` variable can hold it.
- An abstract method has no body: `abstract String channel();`. Every subclass must write it, or the compiler refuses it.
- The subclass constructor calls the parent's first: `Email(String to) { super(to); }`.
- `line.split(" ", 3)` splits a line into at most 3 pieces, so the text keeps its spaces.
- Use `toUpperCase(Locale.ROOT)` so the upper case doesn't depend on the computer's language.

> **Classic Java:** write your classes in the same `Main.java` file, above or below `public class Main`, *without* the `public` keyword.
