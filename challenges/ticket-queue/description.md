# Ticket Queue (ArrayDeque)

Simulate the line at a help desk. People are served in the order they arrive: **first in, first out**.

| Command | Prints |
|---------|--------|
| `arrive NAME` | `NAME joined at position p` (`p` counts from 1 at the front) |
| `serve` | `Serving NAME` for the person at the front, who leaves the line, or `No one waiting` |
| `status` | `Waiting: Ana, Bia` from front to back, or `Waiting: nobody` |

**Input**

- Line 1: `n`, the number of commands
- Then `n` commands. Names have no spaces.

**Output**

One line per command.

**Things to know**

- A **queue** adds at the back and removes from the front. `ArrayDeque` does both quickly: `offer(x)` adds, `poll()` removes and returns the front (or `null` if empty).
- Removing the first element of an `ArrayList` shifts every other element, which gets slow. That's what queues are for.
- `queue.size()` gives the position of the person who just joined.
