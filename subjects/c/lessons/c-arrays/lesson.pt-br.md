## Em resumo

Um array em C é um número fixo de elementos de um tipo, lado a lado na memória. Ele não tem `.length`: você guarda o tamanho, normalmente numa constante, e passa para toda função que recebe o array.

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
    int temps[DAYS] = {21, 23, 19};      // o resto começa em 0
    printf("%.2f\n", average(temps, DAYS));
    return 0;
}
```

Uma função recebe o próprio array, não uma cópia, então pode mudar os elementos (`const` promete que não vai). Um array local fica na **pilha**, que tem só alguns megabytes: faça um array muito grande `static` ou global.

**Cuidado:** o C nunca confere um índice. `temps[7]` compila e lê ou sobrescreve o que estiver em seguida na memória. As verificações de memória do Sphinx pegam isso e dizem a linha.

<!-- readings -->
