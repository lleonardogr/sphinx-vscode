#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static char name[100][21];
static int age[100], score[100];

static int by_name(int a, int b)  { return strcmp(name[a], name[b]); }
static int by_age(int a, int b)   { return age[a] - age[b]; }
static int by_score(int a, int b) { return score[a] - score[b]; }

/* The chosen keys, as pointers to the functions above, and their directions. */
static int (*key[3])(int, int);
static int descending[3];
static int key_count;

static int compare(const void *pa, const void *pb) {
    const int *a = pa, *b = pb;
    for (int k = 0; k < key_count; k++) {
        int r = key[k](*a, *b);
        if (r) {
            return descending[k] ? -r : r;
        }
    }
    return *a - *b;
}

int main(void) {
    int n, idx[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%20s%d%d", name[i], &age[i], &score[i]);
        idx[i] = i;
    }
    char word[16];
    while (key_count < 3 && scanf("%15s", word) == 1) {
        const char *k = word[0] == '-' ? word + 1 : word;
        descending[key_count] = word[0] == '-';
        key[key_count++] = k[0] == 'n' ? by_name : k[0] == 'a' ? by_age : by_score;
    }
    qsort(idx, (size_t) n, sizeof *idx, compare);
    for (int *p = idx; p < idx + n; p++) {
        printf("%s %d %d\n", name[*p], age[*p], score[*p]);
    }
    return 0;
}
