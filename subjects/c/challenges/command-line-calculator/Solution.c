#include <stdio.h>

int main(void) {
    long long a, b;
    char op;
    int lines = 0, errors = 0, read;
    while ((read = scanf("%lld %c %lld", &a, &op, &b)) != EOF) {
        lines++;
        if (read != 3) {
            printf("Error: not a number\n");
            errors++;
            int c;
            while ((c = getchar()) != '\n' && c != EOF) {
                // skip the rest of the bad line
            }
            continue;
        }
        if ((op == '/' || op == '%') && b == 0) {
            printf("Error: division by zero\n");
            errors++;
        } else if (op == '+') {
            printf("= %lld\n", a + b);
        } else if (op == '-') {
            printf("= %lld\n", a - b);
        } else if (op == '*') {
            printf("= %lld\n", a * b);
        } else if (op == '/') {
            printf("= %lld\n", a / b);
        } else if (op == '%') {
            printf("= %lld\n", a % b);
        } else {
            printf("Error: unknown operator\n");
            errors++;
        }
    }
    printf("Lines: %d, errors: %d\n", lines, errors);
    return 0;
}
