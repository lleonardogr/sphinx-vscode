#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: confira os parênteses com uma pilha e imprima OK ou o primeiro erro
    }
    return 0;
}
