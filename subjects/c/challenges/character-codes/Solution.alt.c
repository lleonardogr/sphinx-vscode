#include <stdio.h>

int main(void) {
    unsigned char checksum = 0;
    for (;;) {
        int c = getchar();
        if (c == '\n' || c == EOF) {
            break;
        }
        char ch = (char) c;
        printf("'%c' %3d 0x%02X\n", ch, ch, (unsigned) ch);
        checksum += ch;    // an unsigned char wraps at 256 by itself
    }
    printf("Checksum: 0x%02X\n", (unsigned) checksum);
    return 0;
}
