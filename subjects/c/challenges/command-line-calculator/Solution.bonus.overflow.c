#include <stdio.h>
#include <limits.h>

/* 1 if a op b fits in a long long, and the result in *r. */
static int compute(long long a, char op, long long b, long long *r) {
    switch (op) {
        case '+':
            if ((b > 0 && a > LLONG_MAX - b) || (b < 0 && a < LLONG_MIN - b)) return 0;
            *r = a + b;
            return 1;
        case '-':
            if ((b < 0 && a > LLONG_MAX + b) || (b > 0 && a < LLONG_MIN + b)) return 0;
            *r = a - b;
            return 1;
        case '*':
            if (a != 0 && b != 0) {
                if (a > 0 ? (b > 0 ? a > LLONG_MAX / b : b < LLONG_MIN / a)
                          : (b > 0 ? a < LLONG_MIN / b : a < LLONG_MAX / b)) return 0;
            }
            *r = a * b;
            return 1;
        default:   /* '/' and '%' */
            if (a == LLONG_MIN && b == -1) return 0;
            *r = op == '/' ? a / b : a % b;
            return 1;
    }
}

int main(void) {
    long long a, b, r;
    char op;
    int lines = 0, errors = 0, read;
    while ((read = scanf("%lld %c %lld", &a, &op, &b)) != EOF) {
        lines++;
        if (read != 3) {
            printf("Error: not a number\n");
            errors++;
            int c;
            while ((c = getchar()) != '\n' && c != EOF) {
            }
        } else if (op != '+' && op != '-' && op != '*' && op != '/' && op != '%') {
            printf("Error: unknown operator\n");
            errors++;
        } else if ((op == '/' || op == '%') && b == 0) {
            printf("Error: division by zero\n");
            errors++;
        } else if (!compute(a, op, b, &r)) {
            printf("Error: overflow\n");
            errors++;
        } else {
            printf("= %lld\n", r);
        }
    }
    printf("Lines: %d, errors: %d\n", lines, errors);
    return 0;
}
