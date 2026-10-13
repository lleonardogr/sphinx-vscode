#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    if (fgets(line, sizeof line, stdin) == NULL) {
        line[0] = '\0';
    }
    line[strcspn(line, "\r\n")] = '\0';
    int words = 0, best = 0, best_start = 0;
    int i = 0;
    while (line[i] != '\0') {
        while (line[i] == ' ') {
            i++;
        }
        if (line[i] == '\0') {
            break;
        }
        int start = i;
        while (line[i] != ' ' && line[i] != '\0') {
            i++;
        }
        words++;
        if (i - start > best) {
            best = i - start;
            best_start = start;
        }
    }
    printf("Characters: %zu\n", strlen(line));
    printf("Words: %d\n", words);
    if (words > 0) {
        printf("Longest: %.*s\n", best, &line[best_start]);
    } else {
        printf("Longest: -\n");
    }
    return 0;
}
