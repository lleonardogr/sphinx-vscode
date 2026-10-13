# Odometer

Many cars and microcontrollers count with a **16-bit counter**: it holds 0 to 65535, and one more step brings it back to 0, like an old odometer rolling over from 99999 to 00000. In C an `unsigned` type does exactly that: unsigned arithmetic wraps around, by definition.

A trip counter starts at a reading and adds the distance of each trip. Print the reading after each trip, then how many times it rolled over and the real distance driven.

Starting at 65530, trips of 3 and 10:

```
Reading: 65533
Reading: 00007
Rollovers: 1
Distance: 13
```

65533 + 10 = 65543, which is 7 past 65536: the counter shows `00007`.

**Input**

- Line 1: the starting reading (0 to 65535) and `n`, the number of trips (0 ≤ n ≤ 1000)
- Then `n` lines with a trip distance (0 to 65535)

**Output**

`Reading: ` and the reading with 5 digits after each trip, then `Rollovers: ` and `Distance: `.

**Things to know**

- `unsigned short` has 16 bits on every platform Sphinx runs on: read it with `%hu`. `uint16_t` from `<stdint.h>` says 16 bits in its name.
- A trip is at most 65535, so the counter rolls over at most once per trip.
- This works because the counter is **unsigned**. Overflowing a signed `int` is undefined behavior in C: the program may do anything.
