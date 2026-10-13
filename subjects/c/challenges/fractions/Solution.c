#include <stdio.h>

typedef struct {
    long num;
    long den;     /* always positive */
} Fraction;

static long gcd(long a, long b) {
    if (a < 0) a = -a;
    while (b != 0) {
        long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

static Fraction make(long num, long den) {
    if (den < 0) {
        num = -num;
        den = -den;
    }
    long g = gcd(num, den);
    Fraction f = {num / g, den / g};
    return f;
}

static Fraction add(Fraction a, Fraction b) { return make(a.num * b.den + b.num * a.den, a.den * b.den); }
static Fraction sub(Fraction a, Fraction b) { return make(a.num * b.den - b.num * a.den, a.den * b.den); }
static Fraction mul(Fraction a, Fraction b) { return make(a.num * b.num, a.den * b.den); }
static Fraction divide(Fraction a, Fraction b) { return make(a.num * b.den, a.den * b.num); }

static void print(Fraction f) {
    if (f.den == 1) {
        printf("%ld\n", f.num);
    } else {
        printf("%ld/%ld\n", f.num, f.den);
    }
}

int main(void) {
    long an, ad, bn, bd;
    char op;
    while (scanf("%ld/%ld %c %ld/%ld", &an, &ad, &op, &bn, &bd) == 5) {
        Fraction a = make(an, ad), b = make(bn, bd);
        switch (op) {
            case '+': print(add(a, b)); break;
            case '-': print(sub(a, b)); break;
            case '*': print(mul(a, b)); break;
            default:
                if (b.num == 0) {
                    printf("Error: division by zero\n");
                } else {
                    print(divide(a, b));
                }
        }
    }
    return 0;
}
