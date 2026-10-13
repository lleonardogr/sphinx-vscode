# Day of the Year

Logs, scientific data and many calendars number days from 1 to 365 (366 in a leap year): 1 March is day 60 in 2023 and day 61 in 2024. This exercise uses a classic C idiom: a `switch` whose cases **fall through** on purpose.

Read a date and print its day number, or `Invalid date`.

```
1 3 2024   →   Day 61 of 2024
```

January's 31 days plus February's 29 (2024 is a leap year) plus 1.

**Input**

One line: day, month and year (the year from 1 to 9999).

**Output**

`Day N of YYYY`, or `Invalid date` when the month is not 1 to 12 or the day doesn't exist in that month.

**Things to know**

- A year is a leap year when it is divisible by 4 but not by 100, or divisible by 400: 2024 and 2000 are, 1900 and 2023 are not.
- In a `switch`, a `case` without `break` continues into the next case. Usually a bug; here it is the trick: jump to the month, and every case below adds one earlier month.
- Mark each deliberate fall-through with a `// fall through` comment: some compilers warn about a `case` without `break` otherwise.
- Arrays come in a later unit, so do it without one.
