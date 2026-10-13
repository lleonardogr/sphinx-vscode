#include <stdio.h>

// TODO: defina uma struct Fraction e funções que somam, subtraem,
// multiplicam e dividem frações e as reduzem à forma irredutível

int main(void) {
    long an, ad, bn, bd;
    char op;
    while (scanf("%ld/%ld %c %ld/%ld", &an, &ad, &op, &bn, &bd) == 5) {
        // TODO: calcule e imprima o resultado, ou o erro de divisão por zero
    }
    return 0;
}
