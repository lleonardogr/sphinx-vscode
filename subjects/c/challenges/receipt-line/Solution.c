#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    double total = 0;
    for (int i = 0; i < n; i++) {
        int qty;
        double price;
        scanf("%d %lf", &qty, &price);
        double line = qty * price;
        printf("%3d x %7.2f = %8.2f\n", qty, price, line);
        total += line;
    }
    printf("------------------------\n");
    printf("TOTAL %18.2f\n", total);
    return 0;
}
