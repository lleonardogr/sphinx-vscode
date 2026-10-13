#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char text[64];
    while (scanf("%63s", text) == 1) {
        float f = strtof(text, NULL);

        // TODO: copy f's bits into a uint32_t with memcpy, take out the sign,
        // exponent and mantissa, and print the six lines
    }
    return 0;
}
