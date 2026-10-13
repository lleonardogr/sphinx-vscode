#include <stdio.h>
#include <stdint.h>

/* table[b] is the effect of byte b on the CRC, so each byte costs one lookup instead of 8 steps. */
static uint32_t table[256];

static void build_table(void) {
    for (uint32_t b = 0; b < 256; b++) {
        uint32_t crc = b;
        for (int bit = 0; bit < 8; bit++) {
            crc = (crc >> 1) ^ (0xEDB88320u & (0u - (crc & 1u)));
        }
        table[b] = crc;
    }
}

int main(void) {
    build_table();
    char line[256];
    int ch;
    while ((ch = getchar()) != EOF) {
        uint32_t crc = ~0u;
        long n = 0;
        for (; ch != EOF && ch != '\n'; ch = getchar(), n++) {
            crc = (crc >> 8) ^ table[(crc ^ (unsigned) ch) & 0xFFu];
        }
        snprintf(line, sizeof line, "%08x length=%ld", (unsigned) ~crc, n);
        puts(line);
    }
    return 0;
}
