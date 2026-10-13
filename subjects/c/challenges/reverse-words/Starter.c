#include <stdio.h>
#include <string.h>

// TODO: write a function that reverses the characters between two pointers

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: reverse the whole line, then each word, in place

        printf("%s\n", line);
    }
    return 0;
}
