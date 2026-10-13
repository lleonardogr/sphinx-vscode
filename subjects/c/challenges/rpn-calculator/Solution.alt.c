#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

struct item {
    long long n;
    struct item *next;
};

static struct item *top;
static int size;

static void push(long long n) {
    struct item *it = malloc(sizeof *it);
    if (!it) exit(1);
    it->n = n;
    it->next = top;
    top = it;
    size++;
}

static long long pop(void) {
    struct item *it = top;
    long long n = it->n;
    top = it->next;
    free(it);
    size--;
    return n;
}

int main(void) {
    int c = getchar();
    while (c != EOF) {
        int failed = 0;            /* 1 underflow, 2 division by zero */
        while (c != '\n' && c != EOF) {
            if (c == ' ' || c == '\t' || c == '\r') {
                c = getchar();
                continue;
            }
            char word[64];
            int len = 0;
            while (c != EOF && !isspace(c) && len < 63) {
                word[len++] = (char) c;
                c = getchar();
            }
            word[len] = '\0';
            if (failed) continue;
            int is_op = len == 1 && (word[0] == '+' || word[0] == '-' || word[0] == '*' || word[0] == '/');
            if (!is_op) {
                push(atoll(word));
            } else if (size < 2) {
                failed = 1;
            } else {
                long long y = pop(), x = pop();
                if (word[0] == '/' && y == 0) {
                    failed = 2;
                } else {
                    switch (word[0]) {
                        case '+': push(x + y); break;
                        case '-': push(x - y); break;
                        case '*': push(x * y); break;
                        default:  push(x / y);
                    }
                }
            }
        }
        if (failed == 1) puts("Error: stack underflow");
        else if (failed == 2) puts("Error: division by zero");
        else if (size == 0) puts("Error: empty");
        else if (size > 1) puts("Error: leftover values");
        else printf("%lld\n", top->n);
        while (top) pop();
        if (c == '\n') c = getchar();
    }
    return 0;
}
