#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* The text lives in one block that grows; everything is done with pointers into it. */
static char *text;
static size_t len, cap;

static void grow(size_t extra) {
    if (len + extra + 1 > cap) {
        size_t want = (len + extra + 1) * 2;
        char *p = realloc(text, want);
        if (!p) exit(1);
        text = p;
        cap = want;
    }
}

static int splice(size_t at, size_t removed, const char *added) {
    size_t n = strlen(added);
    if (at > len || removed > len - at) {
        return 0;
    }
    grow(n);
    char *tail = text + at + removed;
    memmove(text + at + n, tail, (size_t) (text + len - tail) + 1);
    memcpy(text + at, added, n);
    len = len - removed + n;
    return 1;
}

int main(void) {
    grow(0);
    text[0] = '\0';
    char line[256];
    while (fgets(line, sizeof line, stdin)) {
        char *end = strchr(line, '\n');
        if (end) *end = '\0';
        int ok = 1;
        if (strncmp(line, "append", 6) == 0) {
            ok = splice(len, 0, line[6] ? line + 7 : "");
        } else if (strncmp(line, "insert ", 7) == 0) {
            char *after;
            long at = strtol(line + 7, &after, 10);
            ok = at >= 0 && after != line + 7 && splice((size_t) at, 0, *after ? after + 1 : "");
        } else if (strncmp(line, "delete ", 7) == 0) {
            long at, n;
            ok = sscanf(line + 7, "%ld %ld", &at, &n) == 2 && at >= 0 && n >= 0 && splice((size_t) at, (size_t) n, "");
        } else if (strcmp(line, "print") == 0) {
            printf("[%s] (%zu)\n", text, len);
        }
        if (!ok) {
            puts("Error: position out of range");
        }
    }
    free(text);
    return 0;
}
