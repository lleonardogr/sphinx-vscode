#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* The history is a doubly linked list with a sentinel node: the document is everything
   from after the sentinel up to `cursor`, and the nodes after cursor can be redone. */
struct entry {
    char word[31];
    struct entry *back, *forward;
};

static struct entry sentinel;
static struct entry *cursor = &sentinel;

static void drop_redo(void) {
    struct entry *e = cursor->forward;
    cursor->forward = NULL;
    while (e) {
        struct entry *after = e->forward;
        free(e);
        e = after;
    }
}

int main(void) {
    char cmd[16];
    while (scanf("%15s", cmd) == 1) {
        if (!strcmp(cmd, "type")) {
            struct entry *e = calloc(1, sizeof *e);
            if (!e || scanf("%30s", e->word) != 1) return 1;
            drop_redo();
            e->back = cursor;
            cursor->forward = e;
            cursor = e;
        } else if (!strcmp(cmd, "undo")) {
            if (cursor == &sentinel) puts("nothing to undo");
            else cursor = cursor->back;
        } else if (!strcmp(cmd, "redo")) {
            if (!cursor->forward) puts("nothing to redo");
            else cursor = cursor->forward;
        } else if (cursor == &sentinel) {
            puts("(empty)");
        } else {
            const char *sep = "";
            for (struct entry *e = sentinel.forward; ; e = e->forward) {
                printf("%s%s", sep, e->word);
                sep = " ";
                if (e == cursor) break;
            }
            putchar('\n');
        }
    }
    cursor = &sentinel;
    drop_redo();
    return 0;
}
