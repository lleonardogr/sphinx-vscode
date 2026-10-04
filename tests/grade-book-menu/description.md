# Grade Book Menu

Build a **grade book** app with a menu. The teacher adds grades, lists them, and asks for statistics and letter grades. This test combines **variables**, **conditionals**, **loops**, a **list** and your own **methods**.

**What your program does**

1. Print the menu **once**, at the start:

   ```
   === Grade Book ===
   1. Add grade
   2. List grades
   3. Statistics
   4. Letter grades
   0. Exit
   ```

2. Then read options, one per line, until the option is `0`:

| Option | Reads | Prints |
|--------|-------|--------|
| `1` | a line with one integer grade | `Added <grade>`, or `Invalid grade` if it isn't between `0` and `100` (the grade isn't added) |
| `2` | nothing | `Grades: 80, 95, 70` (in the order they were added) |
| `3` | nothing | three lines: `Average: 81.67` (two decimals), `Highest: 95`, `Lowest: 70` |
| `4` | nothing | one line per grade, in order: `80 -> B` |
| `0` | nothing | `Goodbye!`, and the program ends |
| anything else | nothing | `Invalid option` |

When there are **no grades yet**, options `2`, `3` and `4` print `No grades yet` instead.

**Letter grades**

| Grade | Letter |
|-------|--------|
| 90 to 100 | A |
| 80 to 89 | B |
| 70 to 79 | C |
| 60 to 69 | D |
| below 60 | F |

**Example**

Input:

```
2
1
80
1
95
1
120
3
4
0
```

Output:

```
=== Grade Book ===
1. Add grade
2. List grades
3. Statistics
4. Letter grades
0. Exit
No grades yet
Added 80
Added 95
Invalid grade
Average: 87.50
Highest: 95
Lowest: 80
80 -> B
95 -> A
Goodbye!
```

**Things to know**

- `List<Integer> grades = new ArrayList<>();` keeps the grades between options. Create it **before** the loop.
- Write a method such as `String letter(int grade)` to keep the menu loop short.
- `"Average: %.2f".formatted(average)` prints two decimals. Remember to divide as a `double`.
