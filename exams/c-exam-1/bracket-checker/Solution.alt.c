#include <stdio.h>

/* Checks one line read with getchar; returns the last character read ('\n' or EOF). */
static int check_line(int c) {
    char expected[256];         /* the closer each open bracket needs */
    int opened_at[256];
    char opener[256];
    int depth = 0, column = 0;
    for (; c != '\n' && c != EOF; c = getchar()) {
        if (c == '\r') {
            continue;
        }
        column++;
        if (c == '(' || c == '[' || c == '{') {
            opener[depth] = (char) c;
            expected[depth] = c == '(' ? ')' : (char) (c + 2);    /* '[' + 2 is ']', '{' + 2 is '}' */
            opened_at[depth++] = column;
        } else if (c == ')' || c == ']' || c == '}') {
            if (depth == 0 || expected[depth - 1] != c) {
                if (depth == 0) {
                    printf("Error at column %d: unexpected '%c'\n", column, c);
                } else {
                    printf("Error at column %d: expected '%c' but found '%c'\n", column, expected[depth - 1], c);
                }
                while (c != '\n' && c != EOF) {
                    c = getchar();
                }
                return c;
            }
            depth--;
        }
    }
    if (depth) {
        printf("Error at end: '%c' from column %d is not closed\n", opener[depth - 1], opened_at[depth - 1]);
    } else {
        puts("OK");
    }
    return c;
}

int main(void) {
    int c = getchar();
    while (c != EOF) {
        if (check_line(c) == EOF) {
            break;
        }
        c = getchar();
    }
    return 0;
}
