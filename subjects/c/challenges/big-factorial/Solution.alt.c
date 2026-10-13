#include <stdio.h>

#define BASE 10000             /* four decimal digits per element */

static int limb[1000];
static int used = 1;

static void multiply(int factor) {
    int carry = 0;
    for (int i = 0; i < used; i++) {
        int value = limb[i] * factor + carry;
        limb[i] = value % BASE;
        carry = value / BASE;
    }
    for (; carry; carry /= BASE) {
        limb[used++] = carry % BASE;
    }
}

static int decimal_length(void) {
    int top = limb[used - 1], digits = 0;
    while (top > 0) {
        digits++;
        top /= 10;
    }
    return (used - 1) * 4 + digits;
}

int main(void) {
    int n;
    scanf("%d", &n);
    limb[0] = 1;
    for (int f = 2; f <= n; f++) {
        multiply(f);
    }
    printf("%d", limb[used - 1]);
    for (int i = used - 2; i >= 0; i--) {
        printf("%04d", limb[i]);
    }
    printf("\nDigits: %d\n", decimal_length());
    return 0;
}
