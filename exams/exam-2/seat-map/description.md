# Seat Map

A small theatre has `rows` rows with `seats` seats each. Read booking requests and then print the seat map.

| Request | Prints |
|---------|--------|
| `book r s` for a free seat | `Booked row r seat s` |
| `book r s` for a seat already taken | `Seat taken` |
| `book r s` outside the theatre | `Invalid seat` |

Rows and seats are numbered **from 1**. After all requests, print the map, one line per row, with `X` for a taken seat and `.` for a free one:

```
X...
..X.
....
```

**Input**

- Line 1: `rows seats` (1 to 20 each)
- Line 2: `n`, the number of requests
- Then `n` lines `book r s`

**Output**

One line per request, then the map.

**Things to know**

- A `boolean[][]` starts with every cell `false` (free).
- Convert from seat numbers to indexes with `r - 1` and `s - 1`.
- Check the range **before** reading the array, or an out-of-range seat will throw an exception.
