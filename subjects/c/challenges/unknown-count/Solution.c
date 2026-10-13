#include <stdio.h>
#include <stdlib.h>

static int compare(const void *a, const void *b) {
    int x = *(const int *) a, y = *(const int *) b;
    return (x > y) - (x < y);
}

int main(void) {
    int capacity = 16, count = 0, value;
    int *values = malloc(capacity * sizeof *values);
    if (values == NULL) {
        return 1;
    }
    while (scanf("%d", &value) == 1) {
        if (count == capacity) {
            capacity *= 2;
            int *bigger = realloc(values, capacity * sizeof *values);
            if (bigger == NULL) {
                free(values);
                return 1;
            }
            values = bigger;
        }
        values[count++] = value;
    }
    printf("Count: %d\n", count);
    if (count > 0) {
        qsort(values, count, sizeof *values, compare);
        double median = count % 2 == 1 ? values[count / 2]
                                       : (values[count / 2 - 1] + (double) values[count / 2]) / 2;
        printf("Median: %.1f\n", median);
    }
    free(values);
    return 0;
}
