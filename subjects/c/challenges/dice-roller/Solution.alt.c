#include <stdio.h>
#include <stdint.h>

/* With reset = 1, starts again from seed; otherwise returns the next value from 0 to 32767. */
static int generator(int reset, uint32_t seed) {
    static uint32_t x = 1;
    if (reset) {
        x = seed;
        return 0;
    }
    x = x * 1103515245u + 12345u;
    return (int) ((x / 65536u) % 32768u);
}

static int count_of(uint32_t seed, int n, int face) {
    generator(1, seed);
    int count = 0;
    while (n-- > 0) {
        if (generator(0, 0) % 6 + 1 == face) {
            count++;
        }
    }
    return count;
}

int main(void) {
    unsigned seed;
    int n;
    if (scanf("%u %d", &seed, &n) != 2) {
        return 1;
    }
    generator(1, seed);
    for (int i = 1; i <= n; i++) {
        printf("%d%c", generator(0, 0) % 6 + 1, i < n ? ' ' : '\n');
    }
    if (n == 0) {
        printf("\n");
    }
    for (int face = 1; face <= 6; face++) {
        printf("%d: %d\n", face, count_of(seed, n, face));
    }
    return 0;
}
