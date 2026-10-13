#include <stdio.h>
#include <string.h>

/* Prints the fields of one CSV line: n | [field] [field] … */
static void print_fields(const char *line) {
    char fields[100][256];
    int count = 0, length = 0, i = 0;
    int quoted = 0;
    for (;;) {
        char c = line[i];
        if (quoted) {
            if (c == '"' && line[i + 1] == '"') {
                fields[count][length++] = '"';
                i += 2;
                continue;
            }
            if (c == '"') {
                quoted = 0;
                i++;
                continue;
            }
            if (c == '\0') {
                break;
            }
            fields[count][length++] = c;
            i++;
            continue;
        }
        if (c == '"' && length == 0) {
            quoted = 1;
            i++;
        } else if (c == ',' || c == '\0') {
            fields[count][length] = '\0';
            count++;
            length = 0;
            if (c == '\0') {
                break;
            }
            i++;
        } else {
            fields[count][length++] = c;
            i++;
        }
    }
    printf("%d |", count);
    for (int f = 0; f < count; f++) {
        printf(" [%s]", fields[f]);
    }
    printf("\n");
}

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        print_fields(line);
    }
    return 0;
}
