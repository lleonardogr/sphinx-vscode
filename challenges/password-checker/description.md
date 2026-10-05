# Password Checker

A sign-up form checks that new passwords are strong. Test the password against these rules, **in this order**, and print one line for **each rule it breaks**:

| Rule | Message |
|------|---------|
| at least 8 characters | `Too short` |
| at least one uppercase letter | `Needs an uppercase letter` |
| at least one lowercase letter | `Needs a lowercase letter` |
| at least one digit | `Needs a digit` |

If it breaks no rule, print `Strong password`.

For `abc`:

```
Too short
Needs an uppercase letter
Needs a digit
```

**Input**

One line with the password. It can contain any characters, including spaces.

**Output**

One message per broken rule, or `Strong password`.

**Things to know**

- `length()` returns the number of characters in a String.
- `Character.isUpperCase(c)`, `Character.isLowerCase(c)` and `Character.isDigit(c)` check one character.
- A `boolean` flag starts as `false` and becomes `true` when the loop finds what it is looking for.
