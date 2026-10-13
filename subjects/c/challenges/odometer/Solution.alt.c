#include <stdio.h>
#include <stdint.h>
#include <limits.h>

int main(void) {
    unsigned startValue;
    int n;
    scanf("%u %d", &startValue, &n);
    uint16_t odometer = (uint16_t) startValue;
    long distance = 0;
    int wraps = 0;
    while (n-- > 0) {
        unsigned trip;
        scanf("%u", &trip);
        if ((unsigned) odometer + trip > USHRT_MAX) {
            wraps++;
        }
        odometer += trip;
        distance += trip;
        printf("Reading: %05u\n", (unsigned) odometer);
    }
    printf("Rollovers: %d\n", wraps);
    printf("Distance: %ld\n", distance);
    return 0;
}
