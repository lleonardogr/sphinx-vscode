#include <stdio.h>
#include <stdlib.h>

/* Builds the triangle with calloc; each row is computed from the one above. */
static long long **build(int n) {
    long long **t = calloc((size_t) n, sizeof *t);
    for (int r = 0; t != NULL && r < n; r++) {
        t[r] = calloc((size_t) r + 1, sizeof **t);
        if (t[r] == NULL) {
            return NULL;
        }
        for (int k = 0; k <= r; k++) {
            t[r][k] = (k == 0 || k == r) ? 1 : t[r - 1][k - 1] + t[r - 1][k];
        }
    }
    return t;
}

static void destroy(long long **t, int n) {
    while (n-- > 0) {
        free(t[n]);
    }
    free(t);
}

int main(void) {
    int n, q, r, k;
    if (scanf("%d %d", &n, &q) != 2) {
        return 1;
    }
    long long **triangle = build(n);
    if (triangle == NULL) {
        return 1;
    }
    long long stored = 0;
    for (int i = 0; i < n; i++) {
        stored += i + 1;
    }
    printf("Stored: %lld\n", stored);
    while (q-- > 0 && scanf("%d %d", &r, &k) == 2) {
        printf("C(%d,%d) = %lld\n", r, k, triangle[r][k]);
    }
    destroy(triangle, n);
    return 0;
}
