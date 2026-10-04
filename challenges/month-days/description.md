# Days in a Month (Switch Expression)

Since Java 14, `switch` can be an **expression** that returns a value. Its arrow labels never fall through, and one `case` can list several values:

```java
int points = switch (medal) {
    case "gold" -> 3;
    case "silver", "bronze" -> 1;
    default -> 0;
};
```

Read a month number and a year, and print how many days that month has. February has 29 days in a leap year (divisible by 4 and not by 100, unless also divisible by 400) and 28 otherwise. For a month outside 1–12, print `Invalid month`.

**Use a switch expression with arrow labels (`case ... ->`).**

**Input**

- Line 1: the month (an integer)
- Line 2: the year

**Output**

The number of days, or `Invalid month`.

**Things to know**

- Arrow labels such as `case 4, 6, 9, 11 -> 30;` never fall through, so no `break` is needed.
- A switch expression must produce a value for every input, so it needs a `default ->` branch.
- The leap-year rule from the previous challenge: `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`.
