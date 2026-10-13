## In short

C works directly on the bits of integers: `&` (and), `|` (or), `^` (xor), `~` (not), `<<` and `>>` (shifts). Use **unsigned** fixed-width types from `<stdint.h>`, such as `uint32_t`: their size is certain, and their shifts are fully defined.

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(void) {
    uint32_t flags = 0;
    flags |= 1u << 3;                     // set bit 3
    flags ^= 1u << 0;                     // flip bit 0
    int bit3 = (flags >> 3) & 1;          // read bit 3
    flags &= ~(1u << 0);                  // clear bit 0
    printf("%u %d\n", (unsigned) flags, bit3);   // 8 1

    float f = 1.0f;
    uint32_t bits;
    memcpy(&bits, &f, sizeof bits);       // the float's own bits
    printf("0x%08X\n", (unsigned) bits); // 0x3F800000
    return 0;
}
```

A **mask** selects a field: `(value >> 5) & 0x3F` takes the 6 bits that start at bit 5.

**Watch out:** shifting by the type's width or more, or shifting a negative signed value, is undefined behavior. Shift unsigned values by less than their width.

<!-- readings -->
