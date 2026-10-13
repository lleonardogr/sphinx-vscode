#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* A circular doubly linked list around a sentinel: no NULL checks at the ends. */
struct line {
    char *text;
    struct line *up, *down;
};

static struct line head = {NULL, &head, &head};
static struct line *cur = &head;      /* &head means "no current line" */

static void link_between(struct line *above, struct line *below, const char *text) {
    struct line *l = malloc(sizeof *l);
    size_t n = strlen(text) + 1;
    if (!l || !(l->text = malloc(n))) exit(1);
    memcpy(l->text, text, n);
    l->up = above;
    l->down = below;
    above->down = l;
    below->up = l;
    cur = l;
}

static char *replace_all(const char *s, const char *from, const char *to, int *count) {
    size_t lf = strlen(from), lt = strlen(to), cap = strlen(s) + 1, used = 0;
    char *out = malloc(cap);
    *count = 0;
    while (out && *s) {
        size_t piece = strncmp(s, from, lf) == 0 ? lt : 1;
        if (used + piece + 1 > cap) {
            char *bigger = realloc(out, cap = 2 * (used + piece + 1));
            if (!bigger) exit(1);
            out = bigger;
        }
        if (strncmp(s, from, lf) == 0) {
            memcpy(out + used, to, lt);
            used += lt;
            s += lf;
            (*count)++;
        } else {
            out[used++] = *s++;
        }
    }
    if (!out) exit(1);
    out[used] = '\0';
    return out;
}

int main(void) {
    char buf[256];
    while (fgets(buf, sizeof buf, stdin)) {
        buf[strcspn(buf, "\r\n")] = '\0';
        char cmd[16] = "";
        int skip = 0;
        sscanf(buf, "%15s%n", cmd, &skip);
        const char *arg = buf[skip] == ' ' ? buf + skip + 1 : buf + skip;
        if (!strcmp(cmd, "append")) {
            link_between(cur, cur->down, arg);
        } else if (!strcmp(cmd, "insert")) {
            link_between(cur == &head ? &head : cur->up, cur == &head ? &head : cur, arg);
        } else if (!strcmp(cmd, "print")) {
            if (head.down == &head) puts("(empty)");
            int k = 0;
            for (struct line *l = head.down; l != &head; l = l->down) {
                printf("%3d%c %s\n", ++k, l == cur ? '>' : ' ', l->text);
            }
        } else if (cur == &head) {
            puts("Error: empty buffer");
        } else if (!strcmp(cmd, "delete")) {
            struct line *gone = cur;
            gone->up->down = gone->down;
            gone->down->up = gone->up;
            cur = gone->down != &head ? gone->down : gone->up;
            free(gone->text);
            free(gone);
        } else if (!strcmp(cmd, "up")) {
            if (cur->up == &head) puts("Error: at top");
            else cur = cur->up;
        } else if (!strcmp(cmd, "down")) {
            if (cur->down == &head) puts("Error: at bottom");
            else cur = cur->down;
        } else {
            char from[128], to[128] = "";
            sscanf(arg, "%127s %127s", from, to);
            int n;
            char *changed = replace_all(cur->text, from, to, &n);
            free(cur->text);
            cur->text = changed;
            printf("Replaced %d\n", n);
        }
    }
    while (head.down != &head) {
        struct line *l = head.down;
        head.down = l->down;
        free(l->text);
        free(l);
    }
    return 0;
}
