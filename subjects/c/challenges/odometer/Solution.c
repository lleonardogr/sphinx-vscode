#include <stdio.h>

int main(void) {
    unsigned short reading;
    int n;
    scanf("%hu %d", &reading, &n);
    unsigned short start = reading;
    int rollovers = 0;
    for (int i = 0; i < n; i++) {
        unsigned trip;
        scanf("%u", &trip);
        unsigned short before = reading;
        reading = reading + trip;      // wraps around past 65535
        if (reading < before) {
            rollovers++;
        }
        printf("Reading: %05hu\n", reading);
    }
    printf("Rollovers: %d\n", rollovers);
    printf("Distance: %ld\n", rollovers * 65536L + reading - start);
    return 0;
}
