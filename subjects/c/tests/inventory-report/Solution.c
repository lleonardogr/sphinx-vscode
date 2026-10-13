#include <stdio.h>
#include <string.h>

#define MAX_ITEMS 50

static char codes[MAX_ITEMS][9];
static char names[MAX_ITEMS][31];
static int quantities[MAX_ITEMS];
static double prices[MAX_ITEMS];
static int order[MAX_ITEMS];

static double value(int item) {
    return quantities[item] * prices[item];
}

/* 1 if item a goes before item b: higher value first, then by code. */
static int before(int a, int b) {
    if (value(a) != value(b)) {
        return value(a) > value(b);
    }
    return strcmp(codes[a], codes[b]) < 0;
}

int main(void) {
    char line[256];
    int n = 0;
    if (fgets(line, sizeof line, stdin) == NULL || sscanf(line, "%d", &n) != 1) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        fgets(line, sizeof line, stdin);
        sscanf(line, "%8[^,],%30[^,],%d,%lf", codes[i], names[i], &quantities[i], &prices[i]);
        order[i] = i;
    }
    /* Selection sort on the order of the items. */
    for (int i = 0; i < n; i++) {
        int best = i;
        for (int j = i + 1; j < n; j++) {
            if (before(order[j], order[best])) {
                best = j;
            }
        }
        int t = order[i];
        order[i] = order[best];
        order[best] = t;
    }
    printf("%-8s %-20s %5s %10s\n", "CODE", "NAME", "QTY", "VALUE");
    double total = 0;
    for (int i = 0; i < n; i++) {
        int item = order[i];
        printf("%-8s %-20.20s %5d %10.2f\n", codes[item], names[item], quantities[item], value(item));
        total += value(item);
    }
    printf("Total value: %.2f\n", total);
    printf("Low stock:");
    int low = 0;
    for (int i = 0; i < n; i++) {
        if (quantities[i] < 5) {
            printf(low == 0 ? " %s" : ", %s", codes[i]);
            low++;
        }
    }
    printf(low == 0 ? " none\n" : "\n");
    return 0;
}
