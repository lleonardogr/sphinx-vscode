## Em resumo

Os arrays têm um tamanho fixado quando você escreve o código. Quando o tamanho vem dos dados, peça memória durante a execução: `malloc(bytes)` devolve um ponteiro para um bloco novo no **heap**, ou `NULL` quando não há. O bloco dura até você chamar `free`, mesmo depois que a função que o criou retorna.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 4, count = 0, value;
    int *values = malloc(capacity * sizeof *values);
    if (values == NULL) return 1;
    while (scanf("%d", &value) == 1) {
        if (count == capacity) {                 // cheio: dobra
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

O `realloc` pode mover o bloco, então continue usando o ponteiro que ele devolve.

**Cuidado:** depois de `free(p)`, `p` ainda guarda o endereço antigo. Usá-lo, ou liberá-lo duas vezes, é comportamento indefinido; as verificações de memória pegam isso.

<!-- readings -->
