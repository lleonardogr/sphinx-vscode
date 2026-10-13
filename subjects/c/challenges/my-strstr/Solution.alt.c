#include <stdio.h>
#include <string.h>

/* 1 if s starts with prefix. */
static int starts_with(const char *s, const char *prefix) {
    if (*prefix == '\0') return 1;
    if (*s != *prefix) return 0;
    return starts_with(s + 1, prefix + 1);
}

char *find(char *text, const char *word) {
    while (*text) {
        if (starts_with(text, word)) {
            return text;
        }
        ++text;
    }
    return NULL;
}

int main(void) {
    char needle[64] = "", haystack[256];
    fgets(needle, sizeof needle, stdin);
    char *end = strchr(needle, '\n');
    if (end) *end = '\0';
    for (int n = 1; fgets(haystack, sizeof haystack, stdin); n++) {
        end = strchr(haystack, '\n');
        if (end) *end = '\0';
        char positions[1024] = "";
        int used = 0;
        for (char *at = haystack; (at = find(at, needle)) != NULL; at++) {
            used += snprintf(positions + used, sizeof positions - used, " %d", (int) (at - haystack));
        }
        printf("%d:%s\n", n, used ? positions : " none");
    }
    return 0;
}
