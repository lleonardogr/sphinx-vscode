#include <stdio.h>

// TODO: define a Fraction struct, and functions that add, subtract,
// multiply and divide fractions and reduce them to lowest terms

int main(void) {
    long an, ad, bn, bd;
    char op;
    while (scanf("%ld/%ld %c %ld/%ld", &an, &ad, &op, &bn, &bd) == 5) {
        // TODO: compute and print the result, or the division-by-zero error
    }
    return 0;
}
