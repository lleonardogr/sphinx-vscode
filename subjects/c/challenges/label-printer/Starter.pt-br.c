#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    int width = 0;
    // Leia a primeira linha inteira: scanf("%d ") também comeria os espaços do começo de um nome.
    if (fgets(line, sizeof line, stdin) != NULL) {
        sscanf(line, "%d", &width);
    }

    // TODO: imprima a borda de cima, depois cada nome (lido com fgets) completado
    // ou cortado na largura, depois a borda de baixo

    return 0;
}
