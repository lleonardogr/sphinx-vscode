# Max of Three (Method)

A **method** is a named piece of code you can call again and again. Write the method `max`, which receives three whole numbers and **returns** the biggest one.

```java
int max(int a, int b, int c)
```

The `main` method is ready: it reads `t` lines with three numbers each and prints `Max: ` followed by what your method returns.

**Input**

- Line 1: `t`, the number of lines that follow
- Then `t` lines with three integers `a b c`

**Output**

`Max: x` for each line.

**Things to know**

- The **parameters** `a`, `b` and `c` receive the values passed in the call `max(1, 2, 3)`.
- `return value;` ends the method and gives `value` back to whoever called it.
- The type before the name (`int`) says what the method returns. Write the comparisons yourself, without `Math.max`.
