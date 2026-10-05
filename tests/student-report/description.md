# Student Report

Read a class's grades and print a report, using **records** and **streams** (no loops). This test combines **collections**, **object-oriented design** and the **Stream API**.

**Input**

- Line 1: `n`, the number of grades (at least 1)
- Then `n` lines `STUDENT COURSE SCORE` (single-word names, scores 0 to 100). A student has at most one grade per course.

**Output**

1. `Students: s, courses: c`
2. For each course in alphabetical order: `COURSE: average A, best NAME (SCORE)`. The best is the highest score; on a tie, the name that comes first alphabetically.
3. `Top student: NAME (average A)`: the highest average over all of the student's grades; ties go to the name that comes first alphabetically.
4. `Below 60: name (COURSE SCORE), …` sorted by student and then course, or `Below 60: none`.

Averages have one decimal place.

**Example**

Input:

```
5
ana Math 90
bruno Math 45
ana Physics 80
carla Math 90
bruno Physics 70
```

Output:

```
Students: 3, courses: 2
Math: average 75.0, best ana (90)
Physics: average 75.0, best ana (80)
Top student: carla (average 90.0)
Below 60: bruno (Math 45)
```

**Things to know**

- A `record Grade(String student, String course, int score)` holds one line of input.
- `Stream.generate(IO::readln).limit(n)` reads `n` lines without a loop.
- `Collectors.groupingBy` (with `TreeMap::new` for sorted keys), `averagingInt` and `joining` cover most of the report.
- `Comparator.comparingInt(...).reversed().thenComparing(...)` sorts by one key descending and breaks ties with another.
