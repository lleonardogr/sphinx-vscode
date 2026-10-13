#include <stdio.h>

void stats(const int *values, int n, int *min, int *max, double *mean) {
    const int *end = values + n;
    long long total = 0;
    *min = *max = *values;
    for (const int *p = values; p != end; ++p) {
        *min = *p < *min ? *p : *min;
        *max = *p > *max ? *p : *max;
        total += *p;
    }
    *mean = total / (double) n;
}

static int count_above(const int *values, int n, double limit) {
    int count = 0;
    while (n-- > 0) {
        count += *values++ > limit;
    }
    return count;
}

int main(void) {
    static int data[1000];
    int n = 0;
    scanf("%d", &n);
    for (int *p = data; p < data + n; p++) {
        scanf("%d", p);
    }
    int min, max;
    double mean;
    stats(data, n, &min, &max, &mean);
    printf("Min: %d\n", min);
    printf("Max: %d\n", max);
    printf("Mean: %.2f\n", mean);
    printf("Above mean: %d\n", count_above(data, n, mean));
    return 0;
}
