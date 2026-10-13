#include <stdio.h>

static long long with_pennies(int amount) {
    return amount >= 0 ? 1 : 0;
}

static long long with_nickels(int amount) {
    return amount < 0 ? 0 : with_nickels(amount - 5) + with_pennies(amount);
}

static long long with_dimes(int amount) {
    return amount < 0 ? 0 : with_dimes(amount - 10) + with_nickels(amount);
}

static long long with_quarters(int amount) {
    return amount < 0 ? 0 : with_quarters(amount - 25) + with_dimes(amount);
}

static long long with_halves(int amount) {
    return amount < 0 ? 0 : with_halves(amount - 50) + with_quarters(amount);
}

int main(void) {
    int amount;
    if (scanf("%d", &amount) == 1) {
        printf("%lld\n", with_halves(amount));
    }
    return 0;
}
