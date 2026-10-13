#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

/* A union shows the same 4 bytes as a float and as a 32-bit integer. */
typedef union {
    float value;
    uint32_t raw;
} FloatBits;

static const char *kind(uint32_t exp, uint32_t frac) {
    switch (exp) {
        case 0:    return frac ? "subnormal" : "zero";
        case 255:  return frac ? "nan" : "infinity";
        default:   return "normal";
    }
}

int main(void) {
    char word[64];
    while (scanf("%63s", word) == 1) {
        FloatBits fb;
        fb.value = (float) strtod(word, NULL);
        uint32_t exp = (fb.raw & 0x7F800000u) >> 23, frac = fb.raw & ((1u << 23) - 1);
        printf("Input: %s\nBits: 0x%08X\nSign: %u\nExponent: %u\nMantissa: 0x%06X\nKind: %s",
               word, (unsigned) fb.raw, (unsigned) (fb.raw >> 31), (unsigned) exp, (unsigned) frac, kind(exp, frac));
        if (exp != 0 && exp != 255) {
            printf(", scale 2^%d", (int) exp - 127);
        }
        printf("\n");
    }
    return 0;
}
