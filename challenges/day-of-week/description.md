# Day of the Week

Read a number from 1 to 7 and print the matching day of the week, where **1 is Monday** and **7 is Sunday**.

For any other number, print `Invalid day`.

**Input**

An integer `n`.

**Output**

`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`, or `Invalid day`.

Use a `switch` statement for this one.

**Things to know**

- `switch (n) { case 1: … break; … default: … }` jumps straight to the matching `case`.
- Without `break`, execution falls through into the next case.
- `default` runs when no case matches, so it handles the invalid numbers.
