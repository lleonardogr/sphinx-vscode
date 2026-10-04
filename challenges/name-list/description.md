# Clean Up a Name List

A sign-up form collected names with messy capitalization and duplicates. Clean the list up with a stream:

1. **capitalize** each name: first letter uppercase, the rest lowercase (`bOB` → `Bob`);
2. remove **duplicates**;
3. **sort** alphabetically;
4. print them separated by `, `.

**Solve it without `for` or `while` loops.**

**Input**

One line of names separated by single spaces.

**Output**

The cleaned-up names, for example `Alice, Bob, Carol`.

**Things to know**

- `.map(...)` transforms each element, `.distinct()` removes duplicates, `.sorted()` sorts.
- `name.substring(0, 1)` is the first letter, and `name.substring(1)` is the rest.
- The order of the steps matters: capitalize **before** removing duplicates, so `bob` and `Bob` count as the same name.
