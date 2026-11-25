#include <stdio.h>
#include <string.h>

static void border(int width) {
    char dashes[41];
    memset(dashes, '-', (size_t) width);
    dashes[width] = '\0';
    printf("+%s+\n", dashes);
}

int main(void) {
    int width = 0;
    char name[128], cell[41];
    if (fgets(name, sizeof name, stdin) == NULL || sscanf(name, "%d", &width) != 1) {
        return 1;
    }
    border(width);
    while (fgets(name, sizeof name, stdin)) {
        name[strcspn(name, "\n")] = '\0';
        int needed = snprintf(cell, (size_t) width + 1, "%s", name);   /* cuts to fit */
        if (needed > width) {
            strcpy(&cell[width - 3], "...");
        }
        printf("|%-*s|\n", width, cell);
    }
    border(width);
    return 0;
}
