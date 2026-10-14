#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: guarde o texto numa memória que cresce com realloc e trate
        // append, insert, delete e print
    }
    return 0;
}
