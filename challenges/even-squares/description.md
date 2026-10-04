# Even Squares

The **Stream API** processes collections as a pipeline of steps instead of loops: *take these numbers → keep some → transform them → collect the result*. It's used everywhere in modern Java, and it's a favourite in job interviews.

Read a list of numbers and print the **squares of the even numbers**, in their original order, separated by spaces. If there are no even numbers, print `(none)`.

**Solve it without `for` or `while` loops.**

**Input**

One line of integers separated by single spaces.

**Output**

The squares of the even numbers, separated by spaces, or `(none)`.

**Things to know**

- `Arrays.stream(line.split(" ")).mapToInt(Integer::parseInt)` turns the line into a stream of `int`s.
- `.filter(n -> n % 2 == 0)` keeps only the values for which the condition is true.
- `.map(n -> n * n)` transforms each value.
- `.mapToObj(String::valueOf).collect(Collectors.joining(" "))` joins the values into one String.
