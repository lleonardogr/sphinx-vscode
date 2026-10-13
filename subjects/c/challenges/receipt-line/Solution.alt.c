#include <stdio.h>

#define WIDTH 24

int main(void) {
    int n, qty, i = 0;
    double price, total = 0;
    if (scanf("%d", &n) != 1) {
        return 1;
    }
    while (i < n && scanf("%d %lf", &qty, &price) == 2) {
        printf("%3d x %7.2f = %8.2f\n", qty, price, qty * price);
        total = total + qty * price;
        i++;
    }
    for (int d = 0; d < WIDTH; d++) {
        putchar('-');
    }
    printf("\nTOTAL%*.2f\n", WIDTH - 5, total);
    return 0;
}
