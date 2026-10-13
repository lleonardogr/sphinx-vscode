#include <stdio.h>

#define MAX_DIGITS 3000

int main(void) {
    int digits[MAX_DIGITS] = {1};   /* least significant digit first */
    int length = 1;
    int n;
    scanf("%d", &n);
    for (int factor = 2; factor <= n; factor++) {
        int carry = 0;
        for (int i = 0; i < length; i++) {
            int product = digits[i] * factor + carry;
            digits[i] = product % 10;
            carry = product / 10;
        }
        while (carry > 0) {
            digits[length] = carry % 10;
            carry /= 10;
            length++;
        }
    }
    for (int i = length - 1; i >= 0; i--) {
        printf("%d", digits[i]);
    }
    printf("\nDigits: %d\n", length);
    return 0;
}
