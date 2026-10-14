#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define KEYS 10000

typedef struct Entry {
    int key, value;
    struct Entry *prev, *next;      /* most recently used at the front */
} Entry;

static Entry *by_key[KEYS];
static Entry *front, *back;
static int size, capacity;

static void unlink_entry(Entry *e) {
    if (e->prev) e->prev->next = e->next; else front = e->next;
    if (e->next) e->next->prev = e->prev; else back = e->prev;
    e->prev = e->next = NULL;
}

static void push_front(Entry *e) {
    e->next = front;
    e->prev = NULL;
    if (front) front->prev = e; else back = e;
    front = e;
}

int main(void) {
    scanf("%d", &capacity);
    char command[8];
    int key, value, hits = 0, misses = 0;
    while (scanf("%7s %d", command, &key) == 2) {
        Entry *e = by_key[key];
        if (strcmp(command, "get") == 0) {
            if (e == NULL) {
                printf("miss\n");
                misses++;
            } else {
                printf("%d\n", e->value);
                hits++;
                unlink_entry(e);
                push_front(e);
            }
            continue;
        }
        scanf("%d", &value);
        if (e != NULL) {
            e->value = value;
            unlink_entry(e);
            push_front(e);
            continue;
        }
        if (size == capacity) {
            Entry *old = back;
            unlink_entry(old);
            by_key[old->key] = NULL;
            printf("evicted %d\n", old->key);
            free(old);
            size--;
        }
        e = malloc(sizeof *e);
        if (e == NULL) {
            return 1;
        }
        e->key = key;
        e->value = value;
        push_front(e);
        by_key[key] = e;
        size++;
    }
    printf("hits=%d misses=%d\n", hits, misses);
    while (front) {
        Entry *next = front->next;
        free(front);
        front = next;
    }
    return 0;
}
