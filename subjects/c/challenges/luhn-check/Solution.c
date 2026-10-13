#include <stdio.h>

/* The Luhn sum: every second digit from the right is doubled, minus 9 when it passes 9. */
int luhn_sum(unsigned long long number) {
    int sum = 0;
    int position = 0;
    while (number > 0) {
        int digit = number % 10;
        if (position % 2 == 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        number /= 10;
        position++;
    }
    return sum;
}

int is_valid(unsigned long long number) {
    return luhn_sum(number) % 10 == 0;
}

int main(void) {
    int t;
    scanf("%d", &t);
    for (int i = 0; i < t; i++) {
        unsigned long long number;
        scanf("%llu", &number);
        printf("%llu %s\n", number, is_valid(number) ? "valid" : "invalid");
    }
    return 0;
}
