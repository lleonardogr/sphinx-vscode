#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char text[64];
    while (scanf("%63s", text) == 1) {
        float f = strtof(text, NULL);

        // TODO: copie os bits de f para um uint32_t com memcpy, tire o sinal,
        // o expoente e a mantissa, e imprima as seis linhas
    }
    return 0;
}
