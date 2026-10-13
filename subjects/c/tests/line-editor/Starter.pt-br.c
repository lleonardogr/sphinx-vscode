#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// TODO: um nó Line duplamente ligado com o texto vindo do malloc, a primeira linha
// e a linha atual

int main(void) {
    char input[256];
    while (fgets(input, sizeof input, stdin) != NULL) {
        input[strcspn(input, "\n")] = '\0';

        // TODO: separe o comando do argumento e trate
        // append, insert, delete, up, down, replace e print
    }
    // TODO: libere todas as linhas
    return 0;
}
