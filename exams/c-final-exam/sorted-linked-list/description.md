# Sorted Linked List

A leaderboard or an event queue keeps its items in order as they arrive. A **sorted linked list** does it without ever moving the others: a new node is linked in where it belongs.

```
add 5
add 1
add 3
print         1 3 5
remove 3
print         1 5
sum           count=2 sum=6
```

**Input**

Commands until the end of the input, one per line:

- `add X`: inserts the integer `X` (between −2·10⁹ and 2·10⁹) in increasing order; equal values go after the ones already there;
- `remove X`: removes one `X`;
- `print`: shows the list;
- `sum`: shows how many values there are and their sum.

**Output**

- `print`: the values in increasing order, separated by spaces, or `(empty)`;
- `remove X` when `X` isn't in the list: `not found X`;
- `sum`: `count=N sum=S`.

**Things to know**

- Allocate one node per value with `malloc`, and free it when it is removed. Free what is left at the end.
- Arrays and `qsort` are not allowed: the list keeps itself in order.
- The sum of two values near 2·10⁹ doesn't fit in an `int`: use `long long`.
