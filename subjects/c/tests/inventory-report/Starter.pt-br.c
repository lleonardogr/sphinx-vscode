#include <stdio.h>
#include <string.h>

int main(void) {
    char line[256];
    int n;
    fgets(line, sizeof line, stdin);
    sscanf(line, "%d", &n);

    // TODO: leia os n itens, ordene-os pelo valor (maior primeiro, depois pelo código),
    // e imprima a tabela, o valor total e os códigos com estoque baixo

    return 0;
}
