#include <stdio.h>
#include <string.h>

int main(void) {
    int width;
    char line[128];
    if (fgets(line, sizeof line, stdin) == NULL || sscanf(line, "%d", &width) != 1) {
        return 1;
    }
    printf("+");
    for (int i = 0; i < width; i++) {
        printf("-");
    }
    printf("+\n");
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        if ((int) strlen(line) <= width) {
            printf("|%-*s|\n", width, line);
        } else {
            printf("|%.*s...|\n", width - 3, line);
        }
    }
    printf("+");
    for (int i = 0; i < width; i++) {
        printf("-");
    }
    printf("+\n");
    return 0;
}
