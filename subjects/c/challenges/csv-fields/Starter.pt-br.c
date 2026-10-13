#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: percorra a linha caractere por caractere, dividindo-a em campos
        // (cuidado com as aspas), e imprima "n | [campo] [campo] ..."
    }
    return 0;
}
