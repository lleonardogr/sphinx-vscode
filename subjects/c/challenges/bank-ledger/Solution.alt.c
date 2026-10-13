#include <stdio.h>
#include <string.h>

enum operation { OP_DEPOSIT, OP_WITHDRAW, OP_TRANSFER, OP_UNKNOWN };

struct account {
    int number;
    char name[21];
    long long cents;
};

struct transaction {
    enum operation op;
    int from, to;
    long long cents;
};

static enum operation parse_operation(const char *word) {
    if (strcmp(word, "deposit") == 0) return OP_DEPOSIT;
    if (strcmp(word, "withdraw") == 0) return OP_WITHDRAW;
    if (strcmp(word, "transfer") == 0) return OP_TRANSFER;
    return OP_UNKNOWN;
}

static int index_of(const struct account *list, int n, int number) {
    for (int i = 0; i < n; i++) {
        if (list[i].number == number) return i;
    }
    return -1;
}

/* Applies one transaction; returns the message to print. */
static const char *apply(struct account *list, int n, struct transaction tx) {
    int a = index_of(list, n, tx.from);
    int b = tx.op == OP_TRANSFER ? index_of(list, n, tx.to) : a;
    if (a < 0 || b < 0 || (tx.op == OP_TRANSFER && a == b)) return "rejected: no such account";
    if (tx.op != OP_DEPOSIT && tx.cents > list[a].cents) return "rejected: insufficient funds";
    if (tx.op == OP_DEPOSIT) {
        list[a].cents += tx.cents;
    } else {
        list[a].cents -= tx.cents;
        if (tx.op == OP_TRANSFER) list[b].cents += tx.cents;
    }
    return "ok";
}

int main(void) {
    struct account list[50];
    int n, t;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        long long whole;
        int frac;
        scanf("%d %20s %lld.%d", &list[i].number, list[i].name, &whole, &frac);
        list[i].cents = whole * 100 + frac;
    }
    scanf("%d", &t);
    for (int k = 1; k <= t; k++) {
        char word[16];
        struct transaction tx = {OP_UNKNOWN, 0, 0, 0};
        long long whole;
        int frac;
        scanf("%15s %d", word, &tx.from);
        tx.op = parse_operation(word);
        if (tx.op == OP_TRANSFER) scanf("%d", &tx.to);
        scanf("%lld.%d", &whole, &frac);
        tx.cents = whole * 100 + frac;
        printf("#%d %s\n", k, apply(list, n, tx));
    }
    for (int i = 0; i < n; i++) {
        printf("%d %s %lld.%02lld\n", list[i].number, list[i].name, list[i].cents / 100, list[i].cents % 100);
    }
    return 0;
}
