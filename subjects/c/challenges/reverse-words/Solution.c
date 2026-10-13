#include <stdio.h>
#include <string.h>

/* Reverses the characters from begin up to, but not including, end. */
static void reverse(char *begin, char *end) {
    while (begin < end) {
        end--;
        char t = *begin;
        *begin = *end;
        *end = t;
        begin++;
    }
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        reverse(line, line + strlen(line));
        char *p = line;
        while (*p != '\0') {
            while (*p == ' ') {
                p++;
            }
            char *word = p;
            while (*p != '\0' && *p != ' ') {
                p++;
            }
            reverse(word, p);
        }
        printf("%s\n", line);
    }
    return 0;
}
