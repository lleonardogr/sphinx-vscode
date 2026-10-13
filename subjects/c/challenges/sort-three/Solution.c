#include <stdio.h>

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

/* Puts the three values in increasing order, in the caller's own variables. */
void sort3(int *a, int *b, int *c) {
    if (*a > *b) swap(a, b);
    if (*b > *c) swap(b, c);
    if (*a > *b) swap(a, b);
}

int main(void) {
    int t;
    scanf("%d", &t);
    for (int i = 0; i < t; i++) {
        int x, y, z;
        scanf("%d %d %d", &x, &y, &z);
        sort3(&x, &y, &z);
        printf("%d %d %d\n", x, y, z);
    }
    return 0;
}
