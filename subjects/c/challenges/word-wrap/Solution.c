#include <stdio.h>
#include <string.h>

int main(void) {
    int width;
    scanf("%d", &width);
    char word[128];
    int line_length = 0;
    while (scanf("%127s", word) == 1) {
        int length = strlen(word);
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
