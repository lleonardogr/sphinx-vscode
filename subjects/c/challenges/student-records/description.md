# Student Records

A student is a name and three scores, and a report needs their average too: values that belong together. Keeping them in parallel arrays, as in the Pointers unit, means every sort must move several arrays in step. A `struct` keeps a student in **one** value, so sorting moves whole records.

Read the students, sort them by average, highest first (equal averages by name), and print a ranked report with a letter grade:

For the class below:

```
6
Ada 95 88 92
Alan 70 85 80
Grace 88 92 95
Linus 59 61 60
Barbara 80 80 80
Ken 100 100 69
```

```
 1. Ada                   91.67 A
 2. Grace                 91.67 A
 3. Ken                   89.67 B
 4. Barbara               80.00 B
 5. Alan                  78.33 C
 6. Linus                 60.00 D
```

**Input**

- Line 1: `n` (1 ≤ n ≤ 100)
- Then `n` lines: a name (1 to 20 characters, no spaces) and three scores from 0 to 100

**Output**

One line per student, printed with `"%2d. %-20s %6.2f %c\n"`: rank, name, average and grade. The grade is `A` for an average of 90 or more, `B` for 80, `C` for 70, `D` for 60, and `F` below.

**Things to know**

- `qsort(students, n, sizeof *students, compare)` sorts an array of structs; `compare` gets pointers to two of them.
- Two students with the same scores have exactly the same average, so they tie and go by name (`strcmp`).
- An array of structs is indexed as usual: `students[i].average`.
