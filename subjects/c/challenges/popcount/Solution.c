#include <stdio.h>
#include <stdint.h>

int main(void) {
    int t;
    scanf("%d", &t);
    for (int i = 0; i < t; i++) {
        uint32_t x;
        scanf("%u", &x);
        int ones = 0, highest = -1;
        for (int bit = 0; bit < 32; bit++) {
            if ((x >> bit) & 1u) {
                ones++;
                highest = bit;
            }
        }
        printf("%u: ones=%d parity=%s highest=", (unsigned) x, ones, ones % 2 == 0 ? "even" : "odd");
        if (highest < 0) {
            printf("none\n");
        } else {
            printf("%d\n", highest);
        }
    }
    return 0;
}
