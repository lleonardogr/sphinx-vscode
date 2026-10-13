#include <stdio.h>
#include <string.h>

// TODO: escreva const char *find(const char *text, const char *word), que devolve
// um ponteiro para a primeira ocorrência em text, ou NULL

int main(void) {
    char word[64], line[256];
    fgets(word, sizeof word, stdin);
    word[strcspn(word, "\n")] = '\0';

    // TODO: para cada linha, imprima o número dela e a posição de cada ocorrência

    return 0;
}
