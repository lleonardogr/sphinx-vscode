#include <stdio.h>

/* Only odd numbers: odd[k] stands for 2k + 1, so the array is half as big. */
static unsigned char odd_composite[5000001];

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 1;
    }
    int count = 1, largest = 2;          /* 2, the only even prime */
    for (int k = 1; 2 * k + 1 <= n; k++) {
        if (odd_composite[k]) {
            continue;
        }
        int p = 2 * k + 1;
        count++;
        largest = p;
        for (long long m = (long long) p * p; m <= n; m += 2LL * p) {
            odd_composite[m / 2] = 1;
        }
    }
    printf("Primes: %d\nLargest: %d\n", count, largest);
    return 0;
}
