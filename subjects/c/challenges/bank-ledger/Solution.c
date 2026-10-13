#include <stdio.h>
#include <string.h>

typedef enum { DEPOSIT, WITHDRAW, TRANSFER } Kind;

typedef struct {
    int id;
    char owner[21];
    long balance;     /* cents */
} Account;

static Account accounts[50];
static int count;

static Account *find(int id) {
    for (int i = 0; i < count; i++) {
        if (accounts[i].id == id) {
            return &accounts[i];
        }
    }
    return NULL;
}

static long read_cents(void) {
    long whole;
    int part;
    scanf("%ld.%d", &whole, &part);
    return whole * 100 + part;
}

static void print_money(long cents) {
    printf("%ld.%02ld", cents / 100, cents % 100);
}

int main(void) {
    scanf("%d", &count);
    for (int i = 0; i < count; i++) {
        scanf("%d %20s", &accounts[i].id, accounts[i].owner);
        accounts[i].balance = read_cents();
    }
    int t;
    scanf("%d", &t);
    for (int i = 1; i <= t; i++) {
        char word[16];
        int from, to = 0;
        scanf("%15s %d", word, &from);
        Kind kind = strcmp(word, "deposit") == 0 ? DEPOSIT : strcmp(word, "withdraw") == 0 ? WITHDRAW : TRANSFER;
        if (kind == TRANSFER) {
            scanf("%d", &to);
        }
        long amount = read_cents();
        Account *a = find(from), *b = kind == TRANSFER ? find(to) : NULL;
        printf("#%d ", i);
        if (a == NULL || (kind == TRANSFER && (b == NULL || b == a))) {
            printf("rejected: no such account\n");
            continue;
        }
        switch (kind) {
            case DEPOSIT:
                a->balance += amount;
                printf("ok\n");
                break;
            case WITHDRAW:
            case TRANSFER:
                if (amount > a->balance) {
                    printf("rejected: insufficient funds\n");
                } else {
                    a->balance -= amount;
                    if (kind == TRANSFER) {
                        b->balance += amount;
                    }
                    printf("ok\n");
                }
                break;
        }
    }
    for (int i = 0; i < count; i++) {
        printf("%d %s ", accounts[i].id, accounts[i].owner);
        print_money(accounts[i].balance);
        printf("\n");
    }
    return 0;
}
