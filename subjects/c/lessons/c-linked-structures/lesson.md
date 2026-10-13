## In short

A **linked list** is a chain of nodes allocated one by one, each holding a value and a pointer to the next node; the last one points to `NULL`. Adding or removing a node only changes a few pointers, however long the list is.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push(Node *head, int value) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) exit(1);
    n->value = value;
    n->next = head;
    return n;
}

int main(void) {
    Node *head = NULL;
    for (int i = 1; i <= 3; i++) head = push(head, i);
    for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->value);
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
```

With a `prev` pointer too, the list is **doubly linked**; with `left` and `right`, nodes form a **tree**.

**Watch out:** save `head->next` before `free(head)`: after the free, the node can't be read.

<!-- readings -->
