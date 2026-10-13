#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n, q;
    scanf("%d %d", &n, &q);
    /* Row r has r + 1 numbers: an array of rows of different lengths. */
    long long **rows = malloc(n * sizeof *rows);
    if (rows == NULL) {
        return 1;
    }
    for (int r = 0; r < n; r++) {
        rows[r] = malloc((r + 1) * sizeof *rows[r]);
        if (rows[r] == NULL) {
            return 1;
        }
        rows[r][0] = rows[r][r] = 1;
        for (int k = 1; k < r; k++) {
            rows[r][k] = rows[r - 1][k - 1] + rows[r - 1][k];
        }
    }
    printf("Stored: %d\n", n * (n + 1) / 2);
    for (int i = 0; i < q; i++) {
        int r, k;
        scanf("%d %d", &r, &k);
        printf("C(%d,%d) = %lld\n", r, k, rows[r][k]);
    }
    for (int r = 0; r < n; r++) {
        free(rows[r]);
    }
    free(rows);
    return 0;
}
