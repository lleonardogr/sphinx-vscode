#include <stdio.h>
#include <string.h>

int main(void) {
    char code[50][9], name[50][31];
    int qty[50];
    long cents[50];            /* the value of each line, in cents */
    char buffer[256];
    int n;
    scanf("%d", &n);
    fgets(buffer, sizeof buffer, stdin);   /* the rest of the first line */
    for (int i = 0; i < n; i++) {
        fgets(buffer, sizeof buffer, stdin);
        buffer[strcspn(buffer, "\r\n")] = '\0';
        char *field = strtok(buffer, ",");
        snprintf(code[i], sizeof code[i], "%s", field);
        field = strtok(NULL, ",");
        snprintf(name[i], sizeof name[i], "%s", field);
        qty[i] = 0;
        sscanf(strtok(NULL, ","), "%d", &qty[i]);
        int whole = 0, part = 0;
        sscanf(strtok(NULL, ","), "%d.%d", &whole, &part);
        cents[i] = qty[i] * (whole * 100L + part);
    }
    /* Insertion sort of the positions. */
    int pos[50];
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0 && (cents[pos[j - 1]] < cents[i] || (cents[pos[j - 1]] == cents[i] && strcmp(code[pos[j - 1]], code[i]) > 0))) {
            pos[j] = pos[j - 1];
            j--;
        }
        pos[j] = i;
    }
    printf("CODE     NAME                   QTY      VALUE\n");
    long total = 0;
    for (int k = 0; k < n; k++) {
        int i = pos[k];
        char shown[21];
        snprintf(shown, sizeof shown, "%.20s", name[i]);
        printf("%-8s %-20s %5d %7ld.%02ld\n", code[i], shown, qty[i], cents[i] / 100, cents[i] % 100);
        total += cents[i];
    }
    printf("Total value: %ld.%02ld\nLow stock:", total / 100, total % 100);
    const char *separator = " ";
    for (int i = 0; i < n; i++) {
        if (qty[i] < 5) {
            printf("%s%s", separator, code[i]);
            separator = ", ";
        }
    }
    printf("%s\n", separator[0] == ' ' ? " none" : "");
    return 0;
}
