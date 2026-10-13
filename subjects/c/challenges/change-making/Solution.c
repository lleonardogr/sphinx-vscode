#include <stdio.h>

/* The k-th coin value, from the largest (k = 0) to the smallest (k = 4). */
int coin(int k) {
    switch (k) {
        case 0: return 50;
        case 1: return 25;
        case 2: return 10;
        case 3: return 5;
        default: return 1;
    }
}

/* Ways to make `amount` with coins k, k + 1, …, 4. */
long long ways(int amount, int k) {
    if (amount == 0) {
        return 1;
    }
    if (amount < 0 || k > 4) {
        return 0;
    }
    /* Either use coin k once more, or never use it again. */
    return ways(amount - coin(k), k) + ways(amount, k + 1);
}

int main(void) {
    int amount;
    scanf("%d", &amount);
    printf("%lld\n", ways(amount, 0));
    return 0;
}
