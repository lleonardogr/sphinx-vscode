#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    int width = 0;
    // Read the whole first line: scanf("%d ") would also eat the spaces a first name starts with.
    if (fgets(line, sizeof line, stdin) != NULL) {
        sscanf(line, "%d", &width);
    }

    // TODO: print the top border, then each name (read with fgets) padded
    // or cut to the width, then the bottom border

    return 0;
}
