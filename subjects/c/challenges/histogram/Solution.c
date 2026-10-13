#include <stdio.h>

#define BUCKETS 10

int main(void) {
    int counts[BUCKETS] = {0};
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int score;
        scanf("%d", &score);
        int bucket = score / 10;
        if (bucket == BUCKETS) {
            bucket = BUCKETS - 1;      /* 100 joins 90-100 */
        }
        counts[bucket]++;
    }
    int most = 0;
    for (int b = 0; b < BUCKETS; b++) {
        printf("%3d-%-3d|", b * 10, b == BUCKETS - 1 ? 100 : b * 10 + 9);
        for (int s = 0; s < counts[b]; s++) {
            putchar('*');
        }
        putchar('\n');
        if (counts[b] > counts[most]) {
            most = b;
        }
    }
    if (n > 0) {
        printf("Most common: %d-%d\n", most * 10, most == BUCKETS - 1 ? 100 : most * 10 + 9);
    }
    return 0;
}
