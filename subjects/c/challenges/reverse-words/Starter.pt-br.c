#include <stdio.h>
#include <string.h>

// TODO: escreva uma função que inverte os caracteres entre dois ponteiros

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: inverta a linha inteira e depois cada palavra, no lugar

        printf("%s\n", line);
    }
    return 0;
}
