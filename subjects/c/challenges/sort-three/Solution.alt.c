#include <stdio.h>

void sort3(int *a, int *b, int *c) {
    int low = *a, high = *a;
    if (*b < low) low = *b;
    if (*c < low) low = *c;
    if (*b > high) high = *b;
    if (*c > high) high = *c;
    long long middle = (long long) *a + *b + *c - low - high;
    *a = low;
    *b = (int) middle;
    *c = high;
}

int main(void) {
    int t, x, y, z;
    scanf("%d", &t);
    while (t-- > 0 && scanf("%d %d %d", &x, &y, &z) == 3) {
        sort3(&x, &y, &z);
        printf("%d %d %d\n", x, y, z);
    }
    return 0;
}
