#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Word {
    char text[31];
    struct Word *prev, *next;
} Word;

static Word *first;      /* every word typed and not discarded */
static Word *current;    /* the last word in the document, or NULL for an empty document */

/* Frees the words after `from` (the redo history). */
static void discard_after(Word *from) {
    Word *w = from == NULL ? first : from->next;
    if (from == NULL) {
        first = NULL;
    } else {
        from->next = NULL;
    }
    while (w != NULL) {
        Word *next = w->next;
        free(w);
        w = next;
    }
}

static void type(const char *text) {
    discard_after(current);
    Word *w = malloc(sizeof *w);
    if (w == NULL) {
        exit(1);
    }
    strcpy(w->text, text);
    w->prev = current;
    w->next = NULL;
    if (current == NULL) {
        first = w;
    } else {
        current->next = w;
    }
    current = w;
}

int main(void) {
    char command[16], text[31];
    while (scanf("%15s", command) == 1) {
        if (strcmp(command, "type") == 0) {
            scanf("%30s", text);
            type(text);
        } else if (strcmp(command, "undo") == 0) {
            if (current == NULL) {
                printf("nothing to undo\n");
            } else {
                current = current->prev;
            }
        } else if (strcmp(command, "redo") == 0) {
            Word *next = current == NULL ? first : current->next;
            if (next == NULL) {
                printf("nothing to redo\n");
            } else {
                current = next;
            }
        } else {
            if (current == NULL) {
                printf("(empty)\n");
            } else {
                for (Word *w = first; w != current->next; w = w->next) {
                    printf(w == first ? "%s" : " %s", w->text);
                }
                printf("\n");
            }
        }
    }
    discard_after(NULL);
    return 0;
}
