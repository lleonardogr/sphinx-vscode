#include <stdio.h>

int is_leap(int year);
int days_in_month(int month, int year);
int day_of_week(int day, int month, int year);

int main(void) {
    int m, y;
    if (scanf("%d %d", &m, &y) != 2) {
        return 1;
    }
    const char *name = m == 1 ? "January" : m == 2 ? "February" : m == 3 ? "March" : m == 4 ? "April"
                     : m == 5 ? "May" : m == 6 ? "June" : m == 7 ? "July" : m == 8 ? "August"
                     : m == 9 ? "September" : m == 10 ? "October" : m == 11 ? "November" : "December";
    printf("%s %d\nSu Mo Tu We Th Fr Sa\n", name, y);
    int start = day_of_week(1, m, y);
    int days = days_in_month(m, y);
    /* Cell c of the grid holds day c - start + 1. */
    for (int c = 0; c < start + days; c++) {
        int d = c - start + 1;
        if (d < 1) {
            printf("   ");
        } else {
            printf("%2d%s", d, (c % 7 == 6 || d == days) ? "\n" : " ");
        }
    }
    return 0;
}

int is_leap(int year) {
    if (year % 400 == 0) return 1;
    if (year % 100 == 0) return 0;
    return year % 4 == 0;
}

int days_in_month(int month, int year) {
    if (month == 2) return 28 + is_leap(year);
    if (month == 4 || month == 6 || month == 9 || month == 11) return 30;
    return 31;
}

/* Zeller's congruence, turned into 0 = Sunday. */
int day_of_week(int day, int month, int year) {
    if (month < 3) {
        month += 12;
        year--;
    }
    int k = year % 100, j = year / 100;
    int h = (day + 13 * (month + 1) / 5 + k + k / 4 + j / 4 + 5 * j) % 7;   /* 0 = Saturday */
    return (h + 6) % 7;
}
