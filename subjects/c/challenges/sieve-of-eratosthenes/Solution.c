#include <stdio.h>

#define MAX 10000000

static char composite[MAX + 1];    /* static: 10 MB is too big for the stack */

int main(void) {
    int n;
    scanf("%d", &n);
    int count = 0, largest = 0;
    for (int i = 2; i <= n; i++) {
        if (!composite[i]) {
            count++;
            largest = i;
            for (long long m = (long long) i * i; m <= n; m += i) {
                composite[m] = 1;
            }
        }
    }
    printf("Primes: %d\n", count);
    printf("Largest: %d\n", largest);
    return 0;
}
