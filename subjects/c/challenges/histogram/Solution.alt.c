#include <stdio.h>

static void bar(int lo, int hi, int count) {
    printf("%3d-%-3d|", lo, hi);
    while (count-- > 0) {
        printf("*");
    }
    printf("\n");
}

int main(void) {
    int tally[11] = {0};      /* tally[10] counts the 100s */
    int n, score, best = 0;
    scanf("%d", &n);
    for (int i = 0; i < n && scanf("%d", &score) == 1; i++) {
        tally[score / 10]++;
    }
    tally[9] += tally[10];
    for (int b = 0; b < 10; b++) {
        bar(10 * b, b < 9 ? 10 * b + 9 : 100, tally[b]);
    }
    for (int b = 1; b < 10; b++) {
        best = tally[b] > tally[best] ? b : best;
    }
    if (n > 0) {
        printf("Most common: %d-%d\n", 10 * best, best < 9 ? 10 * best + 9 : 100);
    }
    return 0;
}
