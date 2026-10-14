#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

/* Inserts value keeping the list in increasing order; works on a pointer to the link to change. */
static void add(Node **head, int value) {
    Node **link = head;
    while (*link != NULL && (*link)->value <= value) {
        link = &(*link)->next;
    }
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        exit(1);
    }
    n->value = value;
    n->next = *link;
    *link = n;
}

static int remove_value(Node **head, int value) {
    for (Node **link = head; *link != NULL; link = &(*link)->next) {
        if ((*link)->value == value) {
            Node *gone = *link;
            *link = gone->next;
            free(gone);
            return 1;
        }
    }
    return 0;
}

int main(void) {
    Node *head = NULL;
    char command[16];
    int value;
    while (scanf("%15s", command) == 1) {
        if (strcmp(command, "add") == 0) {
            scanf("%d", &value);
            add(&head, value);
        } else if (strcmp(command, "remove") == 0) {
            scanf("%d", &value);
            if (!remove_value(&head, value)) {
                printf("not found %d\n", value);
            }
        } else if (strcmp(command, "print") == 0) {
            if (head == NULL) {
                printf("(empty)");
            }
            for (Node *p = head; p != NULL; p = p->next) {
                printf(p == head ? "%d" : " %d", p->value);
            }
            printf("\n");
        } else {
            int count = 0;
            long long sum = 0;
            for (Node *p = head; p != NULL; p = p->next) {
                count++;
                sum += p->value;
            }
            printf("count=%d sum=%lld\n", count, sum);
        }
    }
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
