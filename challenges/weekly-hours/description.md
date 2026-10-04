# Weekly Study Hours (EnumMap)

An **`enum`** is a type with a fixed set of values, like the days of the week. An **`EnumMap`** is a map whose keys are enum values. It is fast, and it always iterates in the order the values are declared.

The `Day` enum is already written. Add up the hours studied on each day.

**Input**

- Line 1: the number of study sessions `n` (at least 1)
- Next `n` lines: a day (`MONDAY` … `SUNDAY`) and a number of hours (at least 1)

**Output**

All seven days **in week order** with their total hours (0 if none), then the day with the most hours. If there's a tie, choose the earliest day in the week.

```
MONDAY: 3
TUESDAY: 0
...
SUNDAY: 0
Busiest: WEDNESDAY
```

**Things to know**

- `EnumMap<Day, Integer> map = new EnumMap<>(Day.class);`
- `Day.values()` returns all the days in order. `Day.valueOf("MONDAY")` turns text into a `Day`.
- Printing an enum value prints its name.
