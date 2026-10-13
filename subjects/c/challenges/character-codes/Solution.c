#include <stdio.h>

int main(void) {
    int c;
    int sum = 0;
    while ((c = getchar()) != EOF && c != '\n') {
        printf("'%c' %3d 0x%02X\n", c, c, c);
        sum = (sum + c) % 256;
    }
    printf("Checksum: 0x%02X\n", sum);
    return 0;
}
