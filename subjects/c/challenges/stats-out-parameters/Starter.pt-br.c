#include <stdio.h>

// TODO: write void stats(const int *values, int n, int *min, int *max, double *mean)

int main(void) {
    int values[1000];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
    }

    // TODO: chame stats com os endereços de três variáveis, conte os valores
    // acima da média e imprima as quatro linhas

    return 0;
}
