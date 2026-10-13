#include <stdio.h>

static int look;        /* the next character of the input, not yet used */
static int error;       /* 0, or the first error on this line: 1 syntax, 2 division by zero */

long long expr(void);
long long term(void);
long long factor(void);

static void advance(void) {
    look = getchar();
}

static void skip_spaces(void) {
    while (look == ' ' || look == '\t') {
        advance();
    }
}

static void fail(int kind) {
    if (error == 0) {
        error = kind;
    }
}

long long expr(void) {
    long long value = term();
    skip_spaces();
    while (look == '+' || look == '-') {
        int op = look;
        advance();
        long long right = term();
        value = op == '+' ? value + right : value - right;
        skip_spaces();
    }
    return value;
}

long long term(void) {
    long long value = factor();
    skip_spaces();
    while (look == '*' || look == '/') {
        int op = look;
        advance();
        long long right = factor();
        if (op == '*') {
            value *= right;
        } else if (right == 0) {
            fail(2);
        } else {
            value /= right;
        }
        skip_spaces();
    }
    return value;
}

long long factor(void) {
    skip_spaces();
    if (look == '-') {
        advance();
        return -factor();
    }
    if (look == '(') {
        advance();
        long long value = expr();
        skip_spaces();
        if (look == ')') {
            advance();
        } else {
            fail(1);
        }
        return value;
    }
    if (look >= '0' && look <= '9') {
        long long value = 0;
        while (look >= '0' && look <= '9') {
            value = value * 10 + (look - '0');
            advance();
        }
        return value;
    }
    fail(1);
    return 0;
}

int main(void) {
    advance();
    while (look != EOF) {
        error = 0;
        long long value = expr();
        skip_spaces();
        if (look != '\n' && look != EOF) {
            fail(1);
        }
        while (look != '\n' && look != EOF) {
            advance();
        }
        if (error == 1) {
            printf("Error: syntax\n");
        } else if (error == 2) {
            printf("Error: division by zero\n");
        } else {
            printf("%lld\n", value);
        }
        if (look == '\n') {
            advance();
        }
    }
    return 0;
}
