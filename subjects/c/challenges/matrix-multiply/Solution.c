#include <stdio.h>
#include <stdlib.h>

static int **new_matrix(int rows, int cols) {
    int **m = malloc(rows * sizeof *m);
    if (m == NULL) {
        return NULL;
    }
    for (int i = 0; i < rows; i++) {
        m[i] = calloc(cols, sizeof *m[i]);
        if (m[i] == NULL) {
            return NULL;
        }
    }
    return m;
}

static void free_matrix(int **m, int rows) {
    for (int i = 0; i < rows; i++) {
        free(m[i]);
    }
    free(m);
}

int main(void) {
    int r, k, c;
    scanf("%d %d %d", &r, &k, &c);
    int **a = new_matrix(r, k), **b = new_matrix(k, c);
    long long **product = malloc(r * sizeof *product);
    if (a == NULL || b == NULL || product == NULL) {
        return 1;
    }
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < k; j++) {
            scanf("%d", &a[i][j]);
        }
    }
    for (int i = 0; i < k; i++) {
        for (int j = 0; j < c; j++) {
            scanf("%d", &b[i][j]);
        }
    }
    long long sum = 0, largest = 0;
    for (int i = 0; i < r; i++) {
        product[i] = calloc(c, sizeof *product[i]);
        if (product[i] == NULL) {
            return 1;
        }
        for (int j = 0; j < c; j++) {
            for (int t = 0; t < k; t++) {
                product[i][j] += (long long) a[i][t] * b[t][j];
            }
            sum += product[i][j];
            if ((i == 0 && j == 0) || product[i][j] > largest) {
                largest = product[i][j];
            }
        }
    }
    printf("Size: %d x %d\nSum: %lld\nLargest: %lld\n", r, c, sum, largest);
    free_matrix(a, r);
    free_matrix(b, k);
    for (int i = 0; i < r; i++) {
        free(product[i]);
    }
    free(product);
    return 0;
}
