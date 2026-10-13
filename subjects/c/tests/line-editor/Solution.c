#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Line {
    char *text;
    struct Line *prev, *next;
} Line;

static Line *first, *current;

static char *copy_of(const char *text) {
    char *s = malloc(strlen(text) + 1);
    if (s == NULL) {
        exit(1);
    }
    strcpy(s, text);
    return s;
}

static Line *new_line(const char *text) {
    Line *line = calloc(1, sizeof *line);
    if (line == NULL) {
        exit(1);
    }
    line->text = copy_of(text);
    return line;
}

static void append(const char *text) {          /* after the current line */
    Line *line = new_line(text);
    if (current == NULL) {
        first = line;
    } else {
        line->prev = current;
        line->next = current->next;
        if (current->next != NULL) {
            current->next->prev = line;
        }
        current->next = line;
    }
    current = line;
}

static void insert(const char *text) {          /* before the current line */
    Line *line = new_line(text);
    if (current == NULL) {
        first = line;
    } else {
        line->next = current;
        line->prev = current->prev;
        if (current->prev != NULL) {
            current->prev->next = line;
        } else {
            first = line;
        }
        current->prev = line;
    }
    current = line;
}

static void delete_current(void) {
    Line *gone = current;
    if (gone->prev != NULL) {
        gone->prev->next = gone->next;
    } else {
        first = gone->next;
    }
    if (gone->next != NULL) {
        gone->next->prev = gone->prev;
    }
    current = gone->next != NULL ? gone->next : gone->prev;
    free(gone->text);
    free(gone);
}

/* Replaces every occurrence of old in the current line with new; returns how many. */
static int replace(const char *old, const char *new) {
    size_t old_len = strlen(old), new_len = strlen(new);
    int count = 0;
    for (const char *p = strstr(current->text, old); p != NULL; p = strstr(p + old_len, old)) {
        count++;
    }
    if (count == 0) {
        return 0;
    }
    char *result = malloc(strlen(current->text) + count * new_len + 1);
    if (result == NULL) {
        exit(1);
    }
    char *out = result;
    const char *in = current->text;
    for (const char *p = strstr(in, old); p != NULL; p = strstr(in, old)) {
        memcpy(out, in, (size_t) (p - in));
        out += p - in;
        memcpy(out, new, new_len);
        out += new_len;
        in = p + old_len;
    }
    strcpy(out, in);
    free(current->text);
    current->text = result;
    return count;
}

int main(void) {
    char input[256];
    while (fgets(input, sizeof input, stdin) != NULL) {
        input[strcspn(input, "\r\n")] = '\0';
        char *space = strchr(input, ' ');
        char *argument = space != NULL ? space + 1 : input + strlen(input);
        if (space != NULL) {
            *space = '\0';
        }
        if (strcmp(input, "append") == 0) {
            append(argument);
        } else if (strcmp(input, "insert") == 0) {
            insert(argument);
        } else if (strcmp(input, "print") == 0) {
            if (first == NULL) {
                printf("(empty)\n");
            }
            int number = 1;
            for (Line *line = first; line != NULL; line = line->next, number++) {
                printf("%3d%c %s\n", number, line == current ? '>' : ' ', line->text);
            }
        } else if (current == NULL) {
            printf("Error: empty buffer\n");
        } else if (strcmp(input, "delete") == 0) {
            delete_current();
        } else if (strcmp(input, "up") == 0) {
            if (current->prev == NULL) {
                printf("Error: at top\n");
            } else {
                current = current->prev;
            }
        } else if (strcmp(input, "down") == 0) {
            if (current->next == NULL) {
                printf("Error: at bottom\n");
            } else {
                current = current->next;
            }
        } else {
            char *new = strchr(argument, ' ');
            *new = '\0';
            printf("Replaced %d\n", replace(argument, new + 1));
        }
    }
    while (first != NULL) {
        Line *next = first->next;
        free(first->text);
        free(first);
        first = next;
    }
    return 0;
}
