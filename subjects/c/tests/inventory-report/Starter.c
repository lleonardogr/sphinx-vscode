#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    int n;
    fgets(line, sizeof line, stdin);
    sscanf(line, "%d", &n);

    // TODO: read the n items, sort them by value (highest first, then by code),
    // and print the table, the total value and the low-stock codes

    return 0;
}
