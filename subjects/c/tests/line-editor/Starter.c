#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// TODO: a doubly linked Line node with its text from malloc, the first line,
// and the current line

int main(void) {
    char input[256];
    while (fgets(input, sizeof input, stdin) != NULL) {
        input[strcspn(input, "\n")] = '\0';

        // TODO: split the command from its argument and handle
        // append, insert, delete, up, down, replace and print
    }
    // TODO: free every line
    return 0;
}
