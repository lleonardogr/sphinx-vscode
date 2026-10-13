#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    long long value;
    struct Node *next;
} Node;

static void push(Node **top, long long value) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) {
        exit(1);
    }
    n->value = value;
    n->next = *top;
    *top = n;
}

static long long pop(Node **top) {
    Node *n = *top;
    long long value = n->value;
    *top = n->next;
    free(n);
    return value;
}

static void clear(Node **top) {
    while (*top != NULL) {
        pop(top);
    }
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        Node *stack = NULL;
        int depth = 0;
        const char *error = NULL;
        for (char *token = strtok(line, " \t\r\n"); token != NULL && error == NULL; token = strtok(NULL, " \t\r\n")) {
            if (strlen(token) == 1 && strchr("+-*/", token[0]) != NULL) {
                if (depth < 2) {
                    error = "stack underflow";
                    break;
                }
                long long b = pop(&stack), a = pop(&stack);
                depth -= 2;
                if (token[0] == '/' && b == 0) {
                    error = "division by zero";
                    break;
                }
                long long r = token[0] == '+' ? a + b : token[0] == '-' ? a - b : token[0] == '*' ? a * b : a / b;
                push(&stack, r);
                depth++;
            } else {
                push(&stack, strtoll(token, NULL, 10));
                depth++;
            }
        }
        if (error == NULL && depth != 1) {
            error = depth == 0 ? "empty" : "leftover values";
        }
        if (error != NULL) {
            printf("Error: %s\n", error);
        } else {
            printf("%lld\n", stack->value);
        }
        clear(&stack);
    }
    return 0;
}
