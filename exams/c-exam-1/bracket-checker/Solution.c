#include <stdio.h>
#include <string.h>

static char closer_for(char opener) {
    return opener == '(' ? ')' : opener == '[' ? ']' : '}';
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        char stack[256];
        int columns[256];
        int top = 0, error = 0;
        for (int i = 0; line[i] != '\0' && !error; i++) {
            char c = line[i];
            if (c == '(' || c == '[' || c == '{') {
                stack[top] = c;
                columns[top] = i + 1;
                top++;
            } else if (c == ')' || c == ']' || c == '}') {
                if (top == 0) {
                    printf("Error at column %d: unexpected '%c'\n", i + 1, c);
                    error = 1;
                } else if (closer_for(stack[top - 1]) != c) {
                    printf("Error at column %d: expected '%c' but found '%c'\n", i + 1, closer_for(stack[top - 1]), c);
                    error = 1;
                } else {
                    top--;
                }
            }
        }
        if (!error) {
            if (top > 0) {
                printf("Error at end: '%c' from column %d is not closed\n", stack[top - 1], columns[top - 1]);
            } else {
                printf("OK\n");
            }
        }
    }
    return 0;
}
