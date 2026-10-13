#include <stdio.h>
#include <string.h>

struct record {
    char name[21];
    int total;          /* the sum of the three scores: comparing sums avoids comparing doubles */
};

static int goes_before(const struct record *a, const struct record *b) {
    return a->total != b->total ? a->total > b->total : strcmp(a->name, b->name) < 0;
}

int main(void) {
    struct record list[100];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int s1, s2, s3;
        scanf("%20s %d %d %d", list[i].name, &s1, &s2, &s3);
        list[i].total = s1 + s2 + s3;
    }
    /* Insertion sort: whole structs are copied with = */
    for (int i = 1; i < n; i++) {
        struct record current = list[i];
        int j = i - 1;
        while (j >= 0 && goes_before(&current, &list[j])) {
            list[j + 1] = list[j];
            j--;
        }
        list[j + 1] = current;
    }
    for (int i = 0; i < n; i++) {
        int t = list[i].total;
        char g = t >= 270 ? 'A' : t >= 240 ? 'B' : t >= 210 ? 'C' : t >= 180 ? 'D' : 'F';
        printf("%2d. %-20s %6.2f %c\n", i + 1, list[i].name, t / 3.0, g);
    }
    return 0;
}
