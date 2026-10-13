#include <stdio.h>

struct fraction {
    long top, bottom;
};

/* Reduces f in place, through a pointer, keeping the bottom positive. */
static void reduce(struct fraction *f) {
    long a = f->top < 0 ? -f->top : f->top, b = f->bottom < 0 ? -f->bottom : f->bottom;
    while (b) {
        long t = a % b;
        a = b;
        b = t;
    }
    if (f->bottom < 0) {
        a = -a;
    }
    f->top /= a;
    f->bottom /= a;
}

static int combine(struct fraction x, char op, struct fraction y, struct fraction *out) {
    switch (op) {
        case '+': out->top = x.top * y.bottom + y.top * x.bottom; out->bottom = x.bottom * y.bottom; break;
        case '-': out->top = x.top * y.bottom - y.top * x.bottom; out->bottom = x.bottom * y.bottom; break;
        case '*': out->top = x.top * y.top; out->bottom = x.bottom * y.bottom; break;
        default:
            if (y.top == 0) return 0;
            out->top = x.top * y.bottom;
            out->bottom = x.bottom * y.top;
    }
    reduce(out);
    return 1;
}

int main(void) {
    struct fraction x, y, r;
    char op;
    while (scanf("%ld/%ld %c %ld/%ld", &x.top, &x.bottom, &op, &y.top, &y.bottom) == 5) {
        if (!combine(x, op, y, &r)) {
            puts("Error: division by zero");
        } else if (r.bottom == 1) {
            printf("%ld\n", r.top);
        } else {
            printf("%ld/%ld\n", r.top, r.bottom);
        }
    }
    return 0;
}
