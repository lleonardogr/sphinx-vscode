#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: check the brackets with a stack and print OK or the first error
    }
    return 0;
}
