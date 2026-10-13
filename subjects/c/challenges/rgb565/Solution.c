#include <stdio.h>
#include <stdint.h>
#include <string.h>

static uint16_t pack(unsigned r, unsigned g, unsigned b) {
    return (uint16_t) (((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3));
}

int main(void) {
    char command[8];
    while (scanf("%7s", command) == 1) {
        if (strcmp(command, "pack") == 0) {
            unsigned r, g, b;
            scanf("%u %u %u", &r, &g, &b);
            printf("0x%04X\n", (unsigned) pack(r, g, b));
        } else {
            unsigned value;
            scanf("%x", &value);
            unsigned r5 = (value >> 11) & 0x1F, g6 = (value >> 5) & 0x3F, b5 = value & 0x1F;
            /* Widen by repeating the top bits, so 31 becomes 255 and 0 stays 0. */
            printf("%u %u %u\n", (r5 << 3) | (r5 >> 2), (g6 << 2) | (g6 >> 4), (b5 << 3) | (b5 >> 2));
        }
    }
    return 0;
}
