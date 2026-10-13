## In short

C has no `String` type: a string is a `char` array whose text ends with the character `'\0'`. Functions find the end by looking for it, so the array needs one extra slot. `<string.h>` has the tools: `strlen`, `strcmp`, `strcpy`, `strchr`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[32];                              // up to 31 characters + '\0'
    if (fgets(name, sizeof name, stdin) == NULL) {
        return 1;
    }
    name[strcspn(name, "\n")] = '\0';           // fgets keeps the newline
    if (strcmp(name, "Ada") == 0) {             // == would compare addresses
        printf("Hello again, %s!\n", name);
    }
    printf("%zu letters\n", strlen(name));
    return 0;
}
```

`fgets` stops at the newline or when the array is full, so it never writes past the end. `snprintf(buffer, sizeof buffer, …)` builds text with the same guarantee.

**Watch out:** a string with no `'\0'` keeps going into whatever memory follows. Leave room for it: `"Ada"` needs 4 chars.

<!-- readings -->
