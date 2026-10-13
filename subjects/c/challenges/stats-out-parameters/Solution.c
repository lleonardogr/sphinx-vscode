#include <stdio.h>

#define MAX 1000

/* Gives back three results through the pointers min, max and mean. */
void stats(const int *values, int n, int *min, int *max, double *mean) {
    long long sum = 0;
    *min = values[0];
    *max = values[0];
    for (int i = 0; i < n; i++) {
        if (values[i] < *min) *min = values[i];
        if (values[i] > *max) *max = values[i];
        sum += values[i];
    }
    *mean = (double) sum / n;
}

int main(void) {
    int values[MAX];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
    }
    int low, high;
    double mean;
    stats(values, n, &low, &high, &mean);
    int above = 0;
    for (int i = 0; i < n; i++) {
        if (values[i] > mean) {
            above++;
        }
    }
    printf("Min: %d\nMax: %d\nMean: %.2f\nAbove mean: %d\n", low, high, mean, above);
    return 0;
}
