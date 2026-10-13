## Em resumo

O C não tem classes nem `String` ou `boolean` embutidos: um programa é feito de funções, começando em `int main(void)`. `#include <stdio.h>` traz o `scanf` e o `printf`. Uma string de formato diz o que ler ou imprimir: `%d` um `int`, `%f` um `double` (`%lf` no `scanf`), `%c` um `char`.

```c
#include <stdio.h>

int main(void) {
    int qty;
    double price;
    scanf("%d %lf", &qty, &price);
    printf("%3d x %7.2f\n", qty, price);   // largura 3; largura 7 com 2 casas
    switch (qty) {
        case 1:  printf("single\n"); break;
        case 2:  printf("pair\n");   break;
        default: printf("many\n");
    }
    return 0;
}
```

Um `char` é um número pequeno (`'A' + 2` é `'C'`), `7 / 2` é `3`, e um valor `unsigned` dá a volta depois do seu máximo. Um `case` sem `break` cai no seguinte.

**Cuidado:** o `scanf` precisa do endereço de cada variável: `scanf("%d", &qty)`. Sem o `&` o programa compila, e depois escreve onde não devia.

<!-- readings -->
