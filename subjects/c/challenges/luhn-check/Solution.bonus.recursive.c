#include <stdio.h>

/* Sum of the digits of n, where `doubled` says whether n's last digit is doubled. */
static int luhn(unsigned long long n, int doubled) {
    if (n == 0) {
        return 0;
    }
    int d = (int) (n % 10);
    if (doubled) {
        d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    }
    return d + luhn(n / 10, !doubled);
}

int main(void) {
    int t;
    scanf("%d", &t);
    while (t-- > 0) {
        unsigned long long n;
        scanf("%llu", &n);
        printf("%llu %s\n", n, luhn(n, 0) % 10 == 0 ? "valid" : "invalid");
    }
    return 0;
}
