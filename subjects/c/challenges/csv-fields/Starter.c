#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';

        // TODO: walk the line character by character, splitting it into fields
        // (watch for quotes), and print "n | [field] [field] ..."
    }
    return 0;
}
