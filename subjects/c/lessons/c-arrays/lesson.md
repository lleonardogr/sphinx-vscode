## In short

A C array is a fixed number of elements of one type, side by side in memory. It has no `.length`: you keep the size yourself, usually in a constant, and pass it to every function that takes the array.

```c
#include <stdio.h>

#define DAYS 7

double average(const int values[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += values[i];
    }
    return (double) sum / n;
}

int main(void) {
    int temps[DAYS] = {21, 23, 19};      // the rest start at 0
    printf("%.2f\n", average(temps, DAYS));
    return 0;
}
```

A function gets the array itself, not a copy, so it can change its elements (`const` promises it won't). A local array lives on the **stack**, which holds only a few megabytes: make a very large array `static` or global.

**Watch out:** C never checks an index. `temps[7]` compiles and reads or overwrites whatever is next in memory. Sphinx's memory checks catch it and tell you the line.

<!-- readings -->
