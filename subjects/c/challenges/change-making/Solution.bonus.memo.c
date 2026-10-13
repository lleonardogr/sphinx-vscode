#include <stdio.h>

static long long memo[10001][5];   /* 0 = not computed yet; otherwise the answer + 1 */

static int coin(int k) {
    return k == 0 ? 50 : k == 1 ? 25 : k == 2 ? 10 : k == 3 ? 5 : 1;
}

static long long ways(int amount, int k) {
    if (amount == 0) return 1;
    if (amount < 0 || k > 4) return 0;
    if (memo[amount][k] == 0) {
        memo[amount][k] = ways(amount - coin(k), k) + ways(amount, k + 1) + 1;
    }
    return memo[amount][k] - 1;
}

int main(void) {
    int amount;
    scanf("%d", &amount);
    printf("%lld\n", ways(amount, 0));
    return 0;
}
