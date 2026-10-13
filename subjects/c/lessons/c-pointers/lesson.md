## In short

A **pointer** holds the address of a variable. `&x` is the address of `x`; if `p` holds it, `*p` is `x` itself, to read or to change. That is how a function changes its caller's variables, and how `scanf` fills yours.

```c
#include <stdio.h>

void min_max(const int *values, int n, int *min, int *max) {
    *min = *max = values[0];
    for (const int *p = values + 1; p < values + n; p++) {
        if (*p < *min) *min = *p;
        if (*p > *max) *max = *p;
    }
}

int main(void) {
    int temps[] = {21, 17, 25, 19};
    int low, high;
    min_max(temps, 4, &low, &high);
    printf("%d to %d\n", low, high);    // 17 to 25
    return 0;
}
```

An array name is the address of its first element, so `values + 1` points at the next element and `a[i]` means `*(a + i)`.

**Watch out:** a pointer must point somewhere valid before you use `*`. Following `NULL`, or an address that was never set, crashes or corrupts memory.

<!-- readings -->
