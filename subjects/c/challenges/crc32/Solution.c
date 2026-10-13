#include <stdio.h>
#include <stdint.h>

/* Updates crc with one byte, one bit at a time (the reflected polynomial 0xEDB88320). */
static uint32_t crc_byte(uint32_t crc, unsigned char byte) {
    crc ^= byte;
    for (int bit = 0; bit < 8; bit++) {
        if (crc & 1u) {
            crc = (crc >> 1) ^ 0xEDB88320u;
        } else {
            crc >>= 1;
        }
    }
    return crc;
}

int main(void) {
    int c = getchar();
    while (c != EOF) {
        uint32_t crc = 0xFFFFFFFFu;
        long length = 0;
        while (c != EOF && c != '\n') {
            crc = crc_byte(crc, (unsigned char) c);
            length++;
            c = getchar();
        }
        printf("%08x length=%ld\n", (unsigned) (crc ^ 0xFFFFFFFFu), length);
        if (c == '\n') {
            c = getchar();
        }
    }
    return 0;
}
