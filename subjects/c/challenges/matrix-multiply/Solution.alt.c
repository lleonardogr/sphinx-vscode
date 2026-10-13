#include <stdio.h>
#include <stdlib.h>

/* Each matrix is one block: element (i, j) of a matrix with `cols` columns is at i * cols + j. */
int main(void) {
    int r, k, c;
    if (scanf("%d %d %d", &r, &k, &c) != 3) {
        return 1;
    }
    int *a = malloc((size_t) r * k * sizeof *a);
    int *b = malloc((size_t) k * c * sizeof *b);
    long long *p = calloc((size_t) r * c, sizeof *p);
    if (a == NULL || b == NULL || p == NULL) {
        return 1;
    }
    for (int i = 0; i < r * k; i++) {
        scanf("%d", &a[i]);
    }
    for (int i = 0; i < k * c; i++) {
        scanf("%d", &b[i]);
    }
    /* i-t-j order walks both blocks row by row, which is kind to the cache. */
    for (int i = 0; i < r; i++) {
        for (int t = 0; t < k; t++) {
            long long x = a[i * k + t];
            for (int j = 0; j < c; j++) {
                p[i * c + j] += x * b[t * c + j];
            }
        }
    }
    long long sum = 0, largest = p[0];
    for (int i = 0; i < r * c; i++) {
        sum += p[i];
        largest = p[i] > largest ? p[i] : largest;
    }
    printf("Size: %d x %d\nSum: %lld\nLargest: %lld\n", r, c, sum, largest);
    free(a);
    free(b);
    free(p);
    return 0;
}
