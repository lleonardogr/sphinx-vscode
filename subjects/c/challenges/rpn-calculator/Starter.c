#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// TODO: a Node struct (a value and a pointer to the next node), and push and pop
// functions that malloc and free nodes

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        // TODO: evaluate the line's tokens with the linked stack, print the result
        // or the error, and free what is left on the stack
    }
    return 0;
}
