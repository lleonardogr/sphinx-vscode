#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int ascending(const void *a, const void *b) {
    const int *x = a, *y = b;
    return *x < *y ? -1 : *x > *y;
}

/* Copies the data into a block twice as big, by hand, and frees the old one. */
static int *grow(int *old, size_t used, size_t *capacity) {
    size_t bigger = *capacity ? *capacity * 2 : 8;
    int *fresh = malloc(bigger * sizeof *fresh);
    if (fresh != NULL && used > 0) {
        memcpy(fresh, old, used * sizeof *old);
    }
    free(old);
    *capacity = bigger;
    return fresh;
}

int main(void) {
    int *data = NULL;
    size_t used = 0, capacity = 0;
    int x;
    while (scanf("%d", &x) == 1) {
        if (used == capacity && (data = grow(data, used, &capacity)) == NULL) {
            return 1;
        }
        data[used++] = x;
    }
    printf("Count: %zu\n", used);
    if (used) {
        qsort(data, used, sizeof *data, ascending);
        long long middle2 = used % 2 ? 2LL * data[used / 2] : (long long) data[used / 2 - 1] + data[used / 2];
        printf("Median: %.1f\n", middle2 / 2.0);
    }
    free(data);
    return 0;
}
