#include <stdio.h>
#include <string.h>

int main(void) {
    int width;
    scanf("%d", &width);
    char word[128];
    int line_length = 0;
    while (scanf("%127s", word) == 1) {
        int length = strlen(word);
        int start = 0;
        if (length > width) {
            /* A long word starts a new line and is cut into pieces of width - 1 letters and a hyphen. */
            if (line_length > 0) {
                printf("\n");
            }
            while (length - start > width) {
                printf("%.*s-\n", width - 1, &word[start]);
                start += width - 1;
            }
            printf("%s", &word[start]);
            line_length = length - start;
            continue;
        }
        if (line_length == 0) {
            printf("%s", word);
            line_length = length;
        } else if (line_length + 1 + length <= width) {
            printf(" %s", word);
            line_length += 1 + length;
        } else {
            printf("\n%s", word);
            line_length = length;
        }
    }
    if (line_length > 0) {
        printf("\n");
    }
    return 0;
}
