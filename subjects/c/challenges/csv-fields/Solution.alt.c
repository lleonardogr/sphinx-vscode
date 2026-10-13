#include <stdio.h>

int main(void) {
    int c = getchar();
    while (c != EOF) {
        char field[256];
        int n = 0, count = 0;
        char out[4096] = "";
        int used = 0;
        for (;;) {
            if (c == '"' && n == 0) {
                /* a quoted field: up to the closing quote, with "" for a quote */
                for (c = getchar(); c != EOF && c != '\n'; c = getchar()) {
                    if (c == '"') {
                        c = getchar();
                        if (c != '"') {
                            break;
                        }
                    }
                    field[n++] = (char) c;
                }
                continue;
            }
            if (c == ',' || c == '\n' || c == EOF) {
                field[n] = '\0';
                used += snprintf(out + used, sizeof out - used, " [%s]", field);
                count++;
                n = 0;
                if (c != ',') {
                    break;
                }
            } else if (c != '\r') {
                field[n++] = (char) c;
            }
            c = getchar();
        }
        printf("%d |%s\n", count, out);
        if (c == '\n') {
            c = getchar();
        }
    }
    return 0;
}
