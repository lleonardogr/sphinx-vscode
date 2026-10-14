#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: keep the text in memory that grows with realloc, and handle
        // append, insert, delete and print
    }
    return 0;
}
