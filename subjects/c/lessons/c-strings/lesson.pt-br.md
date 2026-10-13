## Em resumo

O C não tem um tipo `String`: uma string é um array de `char` cujo texto termina com o caractere `'\0'`. As funções acham o fim procurando por ele, então o array precisa de uma posição a mais. `<string.h>` tem as ferramentas: `strlen`, `strcmp`, `strcpy`, `strchr`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[32];                              // até 31 caracteres + '\0'
    if (fgets(name, sizeof name, stdin) == NULL) {
        return 1;
    }
    name[strcspn(name, "\n")] = '\0';           // o fgets mantém a quebra de linha
    if (strcmp(name, "Ada") == 0) {             // == compararia endereços
        printf("Hello again, %s!\n", name);
    }
    printf("%zu letters\n", strlen(name));
    return 0;
}
```

O `fgets` para na quebra de linha ou quando o array enche, então nunca escreve depois do fim. `snprintf(buffer, sizeof buffer, …)` monta texto com a mesma garantia.

**Cuidado:** uma string sem `'\0'` continua pela memória que vier depois. Deixe espaço para ele: `"Ada"` precisa de 4 chars.

<!-- readings -->
