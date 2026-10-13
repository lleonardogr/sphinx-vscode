#include <stdio.h>
#include <stdint.h>

static uint32_t state;

void seed_random(uint32_t seed) {
    state = seed;
}

int next_random(void) {
    state = state * 1103515245u + 12345u;
    return (state >> 16) & 0x7FFF;
}

int roll_die(void) {
    return next_random() % 6 + 1;
}

int main(void) {
    unsigned seed;
    int n;
    scanf("%u %d", &seed, &n);
    seed_random(seed);
    int c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
    for (int i = 0; i < n; i++) {
        int face = roll_die();
        printf(i == 0 ? "%d" : " %d", face);
        switch (face) {
            case 1: c1++; break;
            case 2: c2++; break;
            case 3: c3++; break;
            case 4: c4++; break;
            case 5: c5++; break;
            default: c6++;
        }
    }
    printf("\n1: %d\n2: %d\n3: %d\n4: %d\n5: %d\n6: %d\n", c1, c2, c3, c4, c5, c6);
    return 0;
}
