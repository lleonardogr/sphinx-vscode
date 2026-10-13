## Em resumo

Um **ponteiro** guarda o endereço de uma variável. `&x` é o endereço de `x`; se `p` o guarda, `*p` é o próprio `x`, para ler ou mudar. É assim que uma função muda as variáveis de quem a chamou, e como o `scanf` preenche as suas.

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

O nome de um array é o endereço do primeiro elemento, então `values + 1` aponta para o elemento seguinte e `a[i]` quer dizer `*(a + i)`.

**Cuidado:** um ponteiro precisa apontar para um lugar válido antes de você usar `*`. Seguir `NULL`, ou um endereço que nunca foi definido, trava ou corrompe a memória.

<!-- readings -->
