#include <stdio.h>

// TODO: write void stats(const int *values, int n, int *min, int *max, double *mean)

int main(void) {
    int values[1000];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
    }

    // TODO: call stats with the addresses of three variables, count the values
    // above the mean, and print the four lines

    return 0;
}
