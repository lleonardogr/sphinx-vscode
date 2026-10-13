#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 100

static char names[MAX][21];
static int ages[MAX], scores[MAX];
static int key_field[3], key_sign[3], keys;   /* field: 0 name, 1 age, 2 score */

static int compare_ints(int a, int b) {
    return (a > b) - (a < b);
}

/* qsort calls this with the addresses of two elements of the order array. */
static int compare_people(const void *x, const void *y) {
    int i = *(const int *) x, j = *(const int *) y;
    for (int k = 0; k < keys; k++) {
        int result;
        switch (key_field[k]) {
            case 0: result = strcmp(names[i], names[j]); break;
            case 1: result = compare_ints(ages[i], ages[j]); break;
            default: result = compare_ints(scores[i], scores[j]);
        }
        if (result != 0) {
            return key_sign[k] * (result > 0 ? 1 : -1);
        }
    }
    return compare_ints(i, j);      /* still equal: keep the input order */
}

int main(void) {
    int n;
    scanf("%d", &n);
    int order[MAX];
    for (int i = 0; i < n; i++) {
        scanf("%20s %d %d", names[i], &ages[i], &scores[i]);
        order[i] = i;
    }
    char key[16];
    while (keys < 3 && scanf("%15s", key) == 1) {
        char *field = key;
        key_sign[keys] = 1;
        if (*field == '-') {
            key_sign[keys] = -1;
            field++;
        }
        key_field[keys] = strcmp(field, "name") == 0 ? 0 : strcmp(field, "age") == 0 ? 1 : 2;
        keys++;
    }
    qsort(order, n, sizeof order[0], compare_people);
    for (int i = 0; i < n; i++) {
        printf("%s %d %d\n", names[order[i]], ages[order[i]], scores[order[i]]);
    }
    return 0;
}
