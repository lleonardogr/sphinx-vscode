#include <stdio.h>

static void skipLine(void) {
    int c = getchar();
    while (c != '\n' && c != EOF) {
        c = getchar();
    }
}

int main(void) {
    int lines = 0, errors = 0;
    for (;;) {
        long long x, y;
        char op;
        int got = scanf("%lld %c %lld", &x, &op, &y);
        if (got == EOF) {
            break;
        }
        lines++;
        if (got < 3) {
            skipLine();
            puts("Error: not a number");
            errors++;
            continue;
        }
        switch (op) {
            case '+': printf("= %lld\n", x + y); break;
            case '-': printf("= %lld\n", x - y); break;
            case '*': printf("= %lld\n", x * y); break;
            case '/':
            case '%':
                if (y == 0) {
                    puts("Error: division by zero");
                    errors++;
                } else {
                    printf("= %lld\n", op == '/' ? x / y : x % y);
                }
                break;
            default:
                puts("Error: unknown operator");
                errors++;
        }
    }
    printf("Lines: %d, errors: %d\n", lines, errors);
    return 0;
}
