#include <stdio.h>

/* The parser reads one character ahead with getchar and puts it back with ungetc. */
static int bad_syntax, divided_by_zero;

static long long sum(void);

static int peek(void) {
    int c;
    do {
        c = getchar();
    } while (c == ' ' || c == '\t');
    ungetc(c, stdin);
    return c;
}

static long long primary(void) {
    int c = peek();
    if (c == '-') {
        getchar();
        return -primary();
    }
    if (c == '(') {
        getchar();
        long long inside = sum();
        if (peek() == ')') {
            getchar();
        } else {
            bad_syntax = 1;
        }
        return inside;
    }
    if (c < '0' || c > '9') {
        bad_syntax = 1;
        return 0;
    }
    long long n = 0;
    for (c = getchar(); c >= '0' && c <= '9'; c = getchar()) {
        n = n * 10 + c - '0';
    }
    ungetc(c, stdin);
    return n;
}

static long long product(void) {
    long long left = primary();
    for (int c = peek(); c == '*' || c == '/'; c = peek()) {
        getchar();
        long long right = primary();
        if (c == '*') {
            left *= right;
        } else if (right != 0) {
            left /= right;
        } else if (!bad_syntax) {
            divided_by_zero = 1;
        }
    }
    return left;
}

static long long sum(void) {
    long long left = product();
    for (int c = peek(); c == '+' || c == '-'; c = peek()) {
        getchar();
        long long right = product();
        left = c == '+' ? left + right : left - right;
    }
    return left;
}

int main(void) {
    while (peek() != EOF) {
        bad_syntax = divided_by_zero = 0;
        long long result = sum();
        int c = getchar();          /* the first character after the expression */
        if (c != '\n' && c != EOF && !divided_by_zero) {
            bad_syntax = 1;
        }
        while (c != '\n' && c != EOF) {
            c = getchar();
        }
        if (divided_by_zero) {
            puts("Error: division by zero");
        } else if (bad_syntax) {
            puts("Error: syntax");
        } else {
            printf("%lld\n", result);
        }
    }
    return 0;
}
