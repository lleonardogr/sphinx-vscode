## Em resumo

Uma **struct** agrupa valores de tipos diferentes sob um nome, como uma classe do Java só com campos. `typedef` dá um nome curto ao tipo, e um `enum` dá nome a um conjunto fixo de opções.

```c
#include <stdio.h>

typedef enum { ACTIVE, FROZEN } Status;

typedef struct {
    char owner[21];
    long balance;            // em centavos
    Status status;
} Account;

void deposit(Account *a, long cents) {   // um ponteiro: muda a struct de quem chamou
    if (a->status == ACTIVE) {
        a->balance += cents;               // a->balance é (*a).balance
    }
}

int main(void) {
    Account accounts[2] = {{"Ada", 1000, ACTIVE}, {"Alan", 500, FROZEN}};
    deposit(&accounts[0], 250);
    printf("%s: %ld\n", accounts[0].owner, accounts[0].balance);   // Ada: 1250
    return 0;
}
```

Atribuir ou passar uma struct **copia todos os campos**, inclusive os arrays de dentro, então funções que mudam uma struct, ou trabalham com uma grande, recebem um ponteiro.

**Cuidado:** `==` não funciona com structs. Compare campo por campo.

<!-- readings -->
