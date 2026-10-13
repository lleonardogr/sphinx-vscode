## In short

C has no classes and no `String` or `boolean` built in: a program is functions, starting at `int main(void)`. `#include <stdio.h>` brings in `scanf` and `printf`. A format string says what to read or print: `%d` an `int`, `%f` a `double` (`%lf` in `scanf`), `%c` a `char`.

```c
#include <stdio.h>

int main(void) {
    int qty;
    double price;
    scanf("%d %lf", &qty, &price);
    printf("%3d x %7.2f\n", qty, price);   // width 3; width 7 with 2 decimals
    switch (qty) {
        case 1:  printf("single\n"); break;
        case 2:  printf("pair\n");   break;
        default: printf("many\n");
    }
    return 0;
}
```

A `char` is a small number (`'A' + 2` is `'C'`), `7 / 2` is `3`, and an `unsigned` value wraps around past its maximum. A `case` without `break` falls into the next one.

**Watch out:** `scanf` needs the address of each variable: `scanf("%d", &qty)`. Without `&` the program compiles, then writes somewhere it shouldn't.

<!-- readings -->
