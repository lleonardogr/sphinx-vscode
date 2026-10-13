#include <stdio.h>
#include <stdint.h>

#define BASE 1000000000u       /* nine decimal digits per element */

static uint32_t limb[4000];
static int used = 1;

int main(void) {
    int n;
    scanf("%d", &n);
    limb[0] = 1;
    for (uint32_t f = 2; f <= (uint32_t) n; f++) {
        uint64_t carry = 0;
        for (int i = 0; i < used; i++) {
            uint64_t value = (uint64_t) limb[i] * f + carry;
            limb[i] = (uint32_t) (value % BASE);
            carry = value / BASE;
        }
        while (carry) {
            limb[used++] = (uint32_t) (carry % BASE);
            carry /= BASE;
        }
    }
    printf("%u", (unsigned) limb[used - 1]);
    int top = 0;
    for (uint32_t t = limb[used - 1]; t; t /= 10) {
        top++;
    }
    for (int i = used - 2; i >= 0; i--) {
        printf("%09u", (unsigned) limb[i]);
    }
    printf("\nDigits: %d\n", (used - 1) * 9 + top);
    return 0;
}
