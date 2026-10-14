#include <stdio.h>

static void print_time(int total) {
    int h = total / 3600;
    total -= h * 3600;
    int m = total / 60;
    int s = total - m * 60;
    printf("%02d:%02d:%02d %cM\n", h == 0 ? 12 : h > 12 ? h - 12 : h, m, s, h >= 12 ? 'P' : 'A');
}

int main(void) {
    int t, x;
    if (scanf("%d", &t) != 1) {
        return 1;
    }
    while (t-- > 0 && scanf("%d", &x) == 1) {
        print_time(x);
    }
    return 0;
}
