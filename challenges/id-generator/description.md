# ID Generator (static)

A help desk gives every new ticket a number: the first is `#1`, the next `#2`, and so on. Complete the class `Ticket` so that **each ticket gets the next id automatically** when it is created, and `Ticket.count()` says how many were created.

The `main` method is ready. For three tickets it prints:

```
#1 Fix login
#2 Add dark mode
#3 Update docs
Tickets created: 3
```

**Input**

- Line 1: `n`, the number of tickets (0 to 100)
- Then `n` lines, each with a ticket title

**Things to know**

- A **`static` field** belongs to the class: there is one copy shared by every object, which is exactly what a counter needs. A normal field gives every object its own copy.
- `nextId++` uses the current value and then adds 1, so `id = nextId++;` takes a number and moves the counter forward in one step.
- A **`static` method** is called on the class (`Ticket.count()`), without an object.
