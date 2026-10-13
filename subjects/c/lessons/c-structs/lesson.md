## In short

A **struct** groups values of different types under one name, like a Java class with only fields. `typedef` gives the type a short name, and an `enum` names a fixed set of choices.

```c
#include <stdio.h>

typedef enum { ACTIVE, FROZEN } Status;

typedef struct {
    char owner[21];
    long balance;            // in cents
    Status status;
} Account;

void deposit(Account *a, long cents) {   // a pointer: changes the caller's struct
    if (a->status == ACTIVE) {
        a->balance += cents;               // a->balance is (*a).balance
    }
}

int main(void) {
    Account accounts[2] = {{"Ada", 1000, ACTIVE}, {"Alan", 500, FROZEN}};
    deposit(&accounts[0], 250);
    printf("%s: %ld\n", accounts[0].owner, accounts[0].balance);   // Ada: 1250
    return 0;
}
```

Assigning or passing a struct **copies every field**, arrays inside it included, so functions that change a struct, or work on a big one, take a pointer.

**Watch out:** `==` doesn't work on structs. Compare them field by field.

<!-- readings -->
