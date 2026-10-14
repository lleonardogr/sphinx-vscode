#include <stdio.h>
#include <stdlib.h>

/* A singly linked list kept in use order, most recent first: simple, O(capacity) per command. */
struct slot {
    int key, value;
    struct slot *next;
};

static struct slot *list;

/* Finds key and moves it to the front; returns it or NULL. */
static struct slot *touch(int key) {
    struct slot **link = &list;
    while (*link && (*link)->key != key) {
        link = &(*link)->next;
    }
    struct slot *found = *link;
    if (found && found != list) {
        *link = found->next;
        found->next = list;
        list = found;
    }
    return found;
}

int main(void) {
    int capacity, count = 0, hits = 0, misses = 0, key, value;
    char cmd[8];
    scanf("%d", &capacity);
    while (scanf("%7s %d", cmd, &key) == 2) {
        struct slot *s = touch(key);
        if (cmd[0] == 'g') {
            if (s) { printf("%d\n", s->value); hits++; }
            else { puts("miss"); misses++; }
            continue;
        }
        scanf("%d", &value);
        if (s) {
            s->value = value;
            continue;
        }
        if (count == capacity) {
            struct slot **link = &list;
            while ((*link)->next) link = &(*link)->next;     /* the last one is the least recently used */
            printf("evicted %d\n", (*link)->key);
            free(*link);
            *link = NULL;
            count--;
        }
        s = malloc(sizeof *s);
        if (!s) return 1;
        s->key = key;
        s->value = value;
        s->next = list;
        list = s;
        count++;
    }
    printf("hits=%d misses=%d\n", hits, misses);
    while (list) {
        struct slot *next = list->next;
        free(list);
        list = next;
    }
    return 0;
}
