#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    size_t cap = 64, len = 0, best_len = 0;
    char *buffer = malloc(cap), *best = calloc(1, 1);
    int lines = 0, c, any = 0;
    if (buffer == NULL || best == NULL) {
        return 1;
    }
    do {
        c = getchar();
        if (c == '\n' || (c == EOF && len > 0)) {
            lines++;
            if (len > best_len || !any) {
                char *copy = realloc(best, len + 1);
                if (copy == NULL) {
                    return 1;
                }
                best = copy;
                memcpy(best, buffer, len);
                best[len] = '\0';
                best_len = len;
                any = 1;
            }
            len = 0;
        } else if (c != EOF) {
            if (len == cap) {
                char *more = realloc(buffer, cap *= 2);
                if (more == NULL) {
                    return 1;
                }
                buffer = more;
            }
            buffer[len++] = (char) c;
        }
    } while (c != EOF);
    printf("Lines: %d\n", lines);
    if (any) {
        printf("Longest: %zu\n%s\n", best_len, best);
    }
    free(buffer);
    free(best);
    return 0;
}
