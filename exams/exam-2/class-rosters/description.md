# Class Rosters

A school keeps track of which students take which courses. Read commands and answer each one:

| Command | Prints |
|---------|--------|
| `enroll STUDENT COURSE` | `Enrolled STUDENT in COURSE`, or `STUDENT is already in COURSE` |
| `drop STUDENT COURSE` | `Dropped STUDENT from COURSE`, or `STUDENT is not in COURSE` |
| `roster COURSE` | `COURSE: Ana, Bia` with the students in alphabetical order, or `COURSE has no students` |
| `courses STUDENT` | `STUDENT: Art, Math` with the courses in alphabetical order, or `STUDENT has no courses` |

**Input**

- Line 1: `n`, the number of commands
- Then `n` commands. Names and courses are single words.

**Output**

One line per command.

**Things to know**

- You need to answer questions in **both directions**, so keep two maps: course → students and student → courses.
- A `TreeSet` keeps its elements sorted and never repeats one. `add` returns `false` if the element was already there, and `remove` returns `false` if it wasn't.
- After a drop, a course (or student) can end up with an empty set: treat it the same as never having had anyone.
