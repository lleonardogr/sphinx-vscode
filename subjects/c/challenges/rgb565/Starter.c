#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(void) {
    char command[8];
    while (scanf("%7s", command) == 1) {
        // TODO: for "pack R G B" print the 16-bit color; for "unpack 0xHHHH"
        // print the three 8-bit channels
    }
    return 0;
}
