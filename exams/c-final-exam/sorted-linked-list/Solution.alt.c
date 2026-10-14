#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct item {
    int n;
    struct item *next;
};

/* A sentinel in front of the first item: inserting and removing never special-case the head. */
static struct item front = {0, NULL};

static void insert_sorted(int n) {
    struct item *before = &front;
    while (before->next && before->next->n <= n) {
        before = before->next;
    }
    struct item *it = calloc(1, sizeof *it);
    if (!it) exit(1);
    it->n = n;
    it->next = before->next;
    before->next = it;
}

static int erase(int n) {
    for (struct item *before = &front; before->next; before = before->next) {
        if (before->next->n == n) {
            struct item *gone = before->next;
            before->next = gone->next;
            free(gone);
            return 1;
        }
    }
    return 0;
}

int main(void) {
    char word[16];
    int n;
    while (scanf("%15s", word) == 1) {
        switch (word[0]) {
            case 'a':
                if (scanf("%d", &n) == 1) insert_sorted(n);
                break;
            case 'r':
                if (scanf("%d", &n) == 1 && !erase(n)) printf("not found %d\n", n);
                break;
            case 'p': {
                const char *sep = "";
                if (!front.next) fputs("(empty)", stdout);
                for (struct item *it = front.next; it; it = it->next, sep = " ") printf("%s%d", sep, it->n);
                putchar('\n');
                break;
            }
            default: {
                int count = 0;
                long long total = 0;
                for (struct item *it = front.next; it; it = it->next) {
                    count++;
                    total += it->n;
                }
                printf("count=%d sum=%lld\n", count, total);
            }
        }
    }
    while (front.next) {
        struct item *it = front.next;
        front.next = it->next;
        free(it);
    }
    return 0;
}
