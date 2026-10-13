#include <stdio.h>
#include <string.h>

static char text[20000];

int main(void) {
    int width;
    if (scanf("%d", &width) != 1) {
        return 1;
    }
    /* Read everything, then wrap: a word is a run of characters that are not spaces. */
    size_t n = fread(text, 1, sizeof text - 1, stdin);
    text[n] = '\0';
    char line[128] = "";
    size_t i = 0;
    while (text[i] != '\0') {
        while (text[i] == ' ' || text[i] == '\n' || text[i] == '\t' || text[i] == '\r') {
            i++;
        }
        if (text[i] == '\0') {
            break;
        }
        size_t start = i;
        while (text[i] != '\0' && text[i] != ' ' && text[i] != '\n' && text[i] != '\t' && text[i] != '\r') {
            i++;
        }
        int len = (int) (i - start);
        int used = (int) strlen(line);
        if (used > 0 && used + 1 + len > width) {
            puts(line);
            line[0] = '\0';
            used = 0;
        }
        if (used > 0) {
            strcat(line, " ");
        }
        strncat(line, &text[start], (size_t) len);
    }
    if (line[0] != '\0') {
        puts(line);
    }
    return 0;
}
