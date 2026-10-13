## In short

Arrays have a size fixed when you write the code. When the size comes from the data, ask for memory while the program runs: `malloc(bytes)` returns a pointer to a new block on the **heap**, or `NULL` when there is none. The block lasts until you `free` it, even after the function that made it returns.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 4, count = 0, value;
    int *values = malloc(capacity * sizeof *values);
    if (values == NULL) return 1;
    while (scanf("%d", &value) == 1) {
        if (count == capacity) {                 // full: double it
            capacity *= 2;
            int *bigger = realloc(values, capacity * sizeof *values);
            if (bigger == NULL) { free(values); return 1; }
            values = bigger;
        }
        values[count++] = value;
    }
    printf("%d numbers\n", count);
    free(values);
    return 0;
}
```

`realloc` may move the block, so keep using the pointer it returns.

**Watch out:** after `free(p)`, `p` still holds the old address. Using it, or freeing it twice, is undefined behavior; memory checks catch it.

<!-- readings -->
