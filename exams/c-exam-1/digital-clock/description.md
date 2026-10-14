# Digital Clock

A device counts the seconds since midnight; its display shows a 12-hour clock. For each count, print the time as `hh:mm:ss AM` or `hh:mm:ss PM`:

```
45296   →   12:34:56 PM
3661    →   01:01:01 AM
0       →   12:00:00 AM
```

**Input**

- Line 1: `t` (1 ≤ t ≤ 100)
- Then `t` lines with a number of seconds since midnight (0 to 86399)

**Output**

One line per count: hours, minutes and seconds with 2 digits each, separated by `:`, then a space and `AM` (before noon) or `PM` (from noon). Midnight and noon show the hour as `12`.

**Things to know**

- `printf("%02d", n)` prints `n` with at least 2 digits, padding with a zero.
- `<time.h>` is not allowed.
