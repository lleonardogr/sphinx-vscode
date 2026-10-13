#include <stdio.h>

int daysIn(int month, int year) {
    switch (month) {
        case 4: case 6: case 9: case 11:
            return 30;
        case 2:
            if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
                return 29;
            }
            return 28;
        default:
            return 31;
    }
}

int main(void) {
    int d, m, y;
    scanf("%d %d %d", &d, &m, &y);
    if (y < 1 || m < 1 || m > 12 || d < 1 || d > daysIn(m, y)) {
        printf("Invalid date\n");
        return 0;
    }
    int n = d;
    for (int before = 1; before < m; before++) {
        n += daysIn(before, y);
    }
    printf("Day %d of %d\n", n, y);
    return 0;
}
