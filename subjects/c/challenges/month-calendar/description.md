# Month Calendar

The Unix command `cal` prints a month as a grid of weeks. Under the hood it needs three small questions answered: is the year a leap year, how many days does the month have, and on which weekday does it start? Each one is a **function**, and the calendar is built from them.

Read a month and a year and print its calendar. For October 2026:

```
October 2026
Su Mo Tu We Th Fr Sa
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

**Input**

One line: the month (1 to 12) and the year (1753 to 9999).

**Output**

The month's name and the year, the weekday header, then one line per week. Each day takes 2 characters (`%2d`), with one space between days. The first week starts with three spaces for each day before the 1st.

**Things to know**

- Write these three functions, and build the calendar from them:
  - `int is_leap(int year)`: divisible by 4 but not by 100, or divisible by 400.
  - `int days_in_month(int month, int year)`
  - `int day_of_week(int day, int month, int year)`: 0 for Sunday up to 6 for Saturday. **Sakamoto's method** adds `y + y/4 − y/100 + y/400 + t + day`, modulo 7, where `t` is 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 for January to December, and `y` is the year minus 1 for January and February.
- Trailing spaces at the end of a line don't matter.
- `<time.h>` is not allowed: the point is to compute it.
