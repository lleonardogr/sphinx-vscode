#include <stdio.h>

int is_leap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int days_in_month(int month, int year) {
    switch (month) {
        case 2:
            return is_leap(year) ? 29 : 28;
        case 4: case 6: case 9: case 11:
            return 30;
        default:
            return 31;
    }
}

/* 0 = Sunday … 6 = Saturday (Sakamoto's method). */
int day_of_week(int day, int month, int year) {
    int offset;
    switch (month) {
        case 1: offset = 0; break;
        case 2: offset = 3; break;
        case 3: offset = 2; break;
        case 4: offset = 5; break;
        case 5: offset = 0; break;
        case 6: offset = 3; break;
        case 7: offset = 5; break;
        case 8: offset = 1; break;
        case 9: offset = 4; break;
        case 10: offset = 6; break;
        case 11: offset = 2; break;
        default: offset = 4;
    }
    if (month < 3) {
        year--;
    }
    return (year + year / 4 - year / 100 + year / 400 + offset + day) % 7;
}

void print_month_name(int month) {
    switch (month) {
        case 1: printf("January"); break;
        case 2: printf("February"); break;
        case 3: printf("March"); break;
        case 4: printf("April"); break;
        case 5: printf("May"); break;
        case 6: printf("June"); break;
        case 7: printf("July"); break;
        case 8: printf("August"); break;
        case 9: printf("September"); break;
        case 10: printf("October"); break;
        case 11: printf("November"); break;
        default: printf("December");
    }
}

int main(void) {
    int month, year;
    scanf("%d %d", &month, &year);
    print_month_name(month);
    printf(" %d\n", year);
    printf("Su Mo Tu We Th Fr Sa\n");
    int column = day_of_week(1, month, year);
    for (int i = 0; i < column; i++) {
        printf("   ");
    }
    int last = days_in_month(month, year);
    for (int day = 1; day <= last; day++) {
        printf("%2d", day);
        column++;
        if (column == 7 || day == last) {
            printf("\n");
            column = 0;
        } else {
            printf(" ");
        }
    }
    return 0;
}
