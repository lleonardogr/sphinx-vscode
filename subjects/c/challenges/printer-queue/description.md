# Printer Queue

An office printer takes jobs in order, **first in, first out**: a queue. Jobs join at the back and print from the front, and someone can cancel a job in the middle. A linked list does all three cheaply: a `tail` pointer to add at the back, the `head` to print from, and relinking to cancel.

Process the commands and report what happens:

```
add report 3     added report
add photo 5      added photo
print 4          done report
cancel photo     cancelled photo
print 1          idle
                 Queue: empty
```

`print 4` finished the 3 pages of `report` and printed 1 page of `photo`, which was then cancelled with 4 pages left.

**Input**

Commands until the end of the input, one per line:

- `add NAME PAGES`: a job (name of 1 to 20 characters, 1 to 1000 pages) joins the back of the queue;
- `print N`: the printer prints `N` pages (1 to 10,000), from the job at the front, then the next ones;
- `cancel NAME`: removes the first job with that name from the queue.

**Output**

- `added NAME` for each `add`;
- for `print`, `done NAME` for each job it finishes, or `idle` if the queue was empty (pages left over when the queue empties are simply lost);
- `cancelled NAME`, or `not found NAME`;
- at the end, `Queue:` followed by each waiting job as ` NAME(PAGES LEFT)`, or ` empty`.

**Things to know**

- Keep `head` and `tail`: adding at the back is `tail->next = job; tail = job;`.
- To remove a node from the middle, the node before it must point past it, so keep the previous node while you walk.
- Free each job when it is done or cancelled, and whatever is left at the end.
