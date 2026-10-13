## In short

A C function has a return type, a name and typed parameters, like a Java `static` method with no class around it. C reads the file from top to bottom, so a function must be **declared** before it is used: either defined above, or announced by a **prototype**.

```c
#include <stdio.h>

int next_ticket(void);           // prototype: defined below

int main(void) {
    for (int i = 0; i < 3; i++) {
        printf("Ticket %d\n", next_ticket());   // 1, 2, 3
    }
    return 0;
}

int next_ticket(void) {
    static int last = 0;          // created once, keeps its value between calls
    last++;
    return last;
}
```

Arguments are **copied** into the parameters: a function that changes its parameter changes only its copy. To give back a result, `return` it.

**Watch out:** write `(void)` for "no parameters". An empty `()` in a declaration means "parameters not stated" in C17, so the compiler can't check the call.

<!-- readings -->
