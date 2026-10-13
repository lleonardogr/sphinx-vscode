#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char text[64];
    while (scanf("%63s", text) == 1) {
        float f = strtof(text, NULL);
        uint32_t bits;
        memcpy(&bits, &f, sizeof bits);
        unsigned sign = bits >> 31;
        unsigned exponent = (bits >> 23) & 0xFFu;
        unsigned mantissa = bits & 0x7FFFFFu;
        printf("Input: %s\n", text);
        printf("Bits: 0x%08X\n", (unsigned) bits);
        printf("Sign: %u\n", sign);
        printf("Exponent: %u\n", exponent);
        printf("Mantissa: 0x%06X\n", mantissa);
        if (exponent == 0xFF) {
            printf("Kind: %s\n", mantissa == 0 ? "infinity" : "nan");
        } else if (exponent == 0) {
            printf("Kind: %s\n", mantissa == 0 ? "zero" : "subnormal");
        } else {
            printf("Kind: normal, scale 2^%d\n", (int) exponent - 127);
        }
    }
    return 0;
}
