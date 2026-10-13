#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct job {
    char name[21];
    int left;
    struct job *next;
};

/* The queue is a pointer to the first job; the cancel uses a pointer to the link to change. */
static struct job *queue;

static void enqueue(const char *name, int pages) {
    struct job **link = &queue;
    while (*link) {
        link = &(*link)->next;
    }
    struct job *j = calloc(1, sizeof *j);
    if (!j) exit(1);
    snprintf(j->name, sizeof j->name, "%s", name);
    j->left = pages;
    *link = j;
}

static int cancel(const char *name) {
    for (struct job **link = &queue; *link; link = &(*link)->next) {
        if (strcmp((*link)->name, name) == 0) {
            struct job *gone = *link;
            *link = gone->next;
            free(gone);
            return 1;
        }
    }
    return 0;
}

int main(void) {
    char cmd[16], who[21];
    int n;
    while (scanf("%15s", cmd) == 1) {
        if (cmd[0] == 'a' && scanf("%20s %d", who, &n) == 2) {
            enqueue(who, n);
            printf("added %s\n", who);
        } else if (cmd[0] == 'p' && scanf("%d", &n) == 1) {
            if (!queue) {
                puts("idle");
            }
            while (n > 0 && queue) {
                int used = n < queue->left ? n : queue->left;
                n -= used;
                if ((queue->left -= used) == 0) {
                    struct job *finished = queue;
                    printf("done %s\n", finished->name);
                    queue = finished->next;
                    free(finished);
                }
            }
        } else if (cmd[0] == 'c' && scanf("%20s", who) == 1) {
            printf("%s %s\n", cancel(who) ? "cancelled" : "not found", who);
        }
    }
    fputs("Queue:", stdout);
    fputs(queue ? "" : " empty", stdout);
    while (queue) {
        struct job *next = queue->next;
        printf(" %s(%d)", queue->name, queue->left);
        free(queue);
        queue = next;
    }
    putchar('\n');
    return 0;
}
