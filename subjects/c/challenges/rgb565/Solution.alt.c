#include <stdio.h>
#include <stdint.h>

#define RED_MASK   0xF800u
#define GREEN_MASK 0x07E0u
#define BLUE_MASK  0x001Fu

static unsigned widen(unsigned value, int bits) {
    return (value << (8 - bits)) | (value >> (2 * bits - 8));
}

int main(void) {
    char word[8];
    while (scanf("%7s", word) == 1) {
        if (word[0] == 'p') {
            unsigned r, g, b;
            scanf("%u%u%u", &r, &g, &b);
            uint16_t color = (uint16_t) (((r & 0xF8u) << 8) | ((g & 0xFCu) << 3) | (b >> 3));
            printf("0x%04X\n", (unsigned) color);
        } else {
            unsigned c;
            scanf("%x", &c);
            unsigned r = (c & RED_MASK) >> 11, g = (c & GREEN_MASK) >> 5, b = c & BLUE_MASK;
            printf("%u %u %u\n", widen(r, 5), widen(g, 6), widen(b, 5));
        }
    }
    return 0;
}
