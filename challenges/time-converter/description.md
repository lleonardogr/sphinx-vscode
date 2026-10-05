# Time Converter

A stopwatch shows a time as a number of seconds. Convert it into hours, minutes and seconds, the way a clock would show it.

For example, `3725` seconds is 1 hour, 2 minutes and 5 seconds.

**Input**

A whole number of seconds `s` (0 ≤ s ≤ 1,000,000).

**Output**

```
Hours: 1
Minutes: 2
Seconds: 5
```

**Things to know**

- `/` between two `int` values drops the decimals: `3725 / 3600` is `1`.
- `%` gives what is left over: `3725 % 3600` is `125`.
- One hour is `3600` seconds and one minute is `60` seconds. Hours can go above 24.
