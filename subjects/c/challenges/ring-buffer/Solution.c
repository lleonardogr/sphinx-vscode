#include <stdio.h>

#define MAX_K 100

int main(void) {
    int window[MAX_K];
    int k, n;
    scanf("%d %d", &k, &n);
    int next = 0, filled = 0;
    long long sum = 0;
    for (int i = 0; i < n; i++) {
        int reading;
        scanf("%d", &reading);
        if (filled == k) {
            int dropped = window[next];
            sum -= dropped;
            window[next] = reading;
            sum += reading;
            next = (next + 1) % k;
            printf("%.2f (dropped %d)\n", (double) sum / k, dropped);
        } else {
            window[next] = reading;
            sum += reading;
            next = (next + 1) % k;
            filled++;
            printf("%.2f\n", (double) sum / filled);
        }
    }
    return 0;
}
