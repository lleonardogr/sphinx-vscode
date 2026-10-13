#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    long total = 0;
    for (int i = 0; i < n; i++) {
        int qty, reais, cents;
        scanf("%d %d.%d", &qty, &reais, &cents);
        long price = reais * 100L + cents;
        long line = qty * price;
        printf("%3d x %4ld.%02ld = %5ld.%02ld\n", qty, price / 100, price % 100, line / 100, line % 100);
        total += line;
    }
    printf("------------------------\n");
    printf("TOTAL %15ld.%02ld\n", total / 100, total % 100);
    return 0;
}
