#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *text;
    size_t length, capacity;
} Buffer;

/* Makes room for at least `needed` characters plus the '\0'. */
static void reserve(Buffer *b, size_t needed) {
    if (needed + 1 <= b->capacity) {
        return;
    }
    size_t capacity = b->capacity ? b->capacity : 16;
    while (capacity < needed + 1) {
        capacity *= 2;
    }
    char *bigger = realloc(b->text, capacity);
    if (bigger == NULL) {
        exit(1);
    }
    b->text = bigger;
    b->capacity = capacity;
}

static void insert(Buffer *b, size_t pos, const char *s) {
    size_t n = strlen(s);
    reserve(b, b->length + n);
    memmove(b->text + pos + n, b->text + pos, b->length - pos + 1);
    memcpy(b->text + pos, s, n);
    b->length += n;
}

int main(void) {
    Buffer b = {NULL, 0, 0};
    reserve(&b, 0);
    b.text[0] = '\0';
    char line[256], command[16];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        int used = 0;
        if (sscanf(line, "%15s%n", command, &used) != 1) {
            continue;
        }
        const char *rest = line[used] == ' ' ? line + used + 1 : line + used;
        if (strcmp(command, "append") == 0) {
            insert(&b, b.length, rest);
        } else if (strcmp(command, "insert") == 0) {
            long pos;
            int skip = 0;
            if (sscanf(rest, "%ld%n", &pos, &skip) != 1 || pos < 0 || (size_t) pos > b.length) {
                printf("Error: position out of range\n");
                continue;
            }
            const char *text = rest[skip] == ' ' ? rest + skip + 1 : rest + skip;
            insert(&b, (size_t) pos, text);
        } else if (strcmp(command, "delete") == 0) {
            long pos, count;
            if (sscanf(rest, "%ld %ld", &pos, &count) != 2 || pos < 0 || count < 0 || (size_t) (pos + count) > b.length) {
                printf("Error: position out of range\n");
                continue;
            }
            memmove(b.text + pos, b.text + pos + count, b.length - (size_t) (pos + count) + 1);
            b.length -= (size_t) count;
        } else {
            printf("[%s] (%zu)\n", b.text, b.length);
        }
    }
    free(b.text);
    return 0;
}
