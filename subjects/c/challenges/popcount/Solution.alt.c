#include <stdio.h>
#include <stdint.h>

/* Kernighan: x & (x - 1) clears the lowest set bit, so the loop runs once per 1 bit. */
static int count_ones(uint32_t x) {
    int n = 0;
    while (x) {
        x &= x - 1;
        n++;
    }
    return n;
}

static int highest_bit(uint32_t x) {
    int position = -1;
    while (x) {
        x >>= 1;
        position++;
    }
    return position;
}

int main(void) {
    int t;
    unsigned value;
    scanf("%d", &t);
    while (t-- > 0 && scanf("%u", &value) == 1) {
        int ones = count_ones(value), top = highest_bit(value);
        char where[8] = "none";
        if (top >= 0) {
            snprintf(where, sizeof where, "%d", top);
        }
        printf("%u: ones=%d parity=%s highest=%s\n", value, ones, (ones & 1) ? "odd" : "even", where);
    }
    return 0;
}
