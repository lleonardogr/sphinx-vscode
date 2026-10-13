#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// TODO: uma struct Node (um valor e um ponteiro para o próximo nó) e funções push e pop
// que dão malloc e free nos nós

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        // TODO: avalie os símbolos da linha com a pilha ligada, imprima o resultado
        // ou o erro, e libere o que sobrou na pilha
    }
    return 0;
}
