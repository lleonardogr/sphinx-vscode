#include <stdio.h>

int main(void) {
    int day, month, year;
    scanf("%d %d %d", &day, &month, &year);
    int leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    int inMonth;
    switch (month) {
        case 2:
            inMonth = leap ? 29 : 28;
            break;
        case 4: case 6: case 9: case 11:
            inMonth = 30;
            break;
        default:
            inMonth = 31;
    }
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > inMonth) {
        printf("Invalid date\n");
        return 0;
    }
    int total = day;
    switch (month) {      // each case adds the month before it
        case 12: total += 30;  // fall through
        case 11: total += 31;  // fall through
        case 10: total += 30;  // fall through
        case 9:  total += 31;  // fall through
        case 8:  total += 31;  // fall through
        case 7:  total += 30;  // fall through
        case 6:  total += 31;  // fall through
        case 5:  total += 30;  // fall through
        case 4:  total += 31;  // fall through
        case 3:  total += leap ? 29 : 28;  // fall through
        case 2:  total += 31;
    }
    printf("Day %d of %d\n", total, year);
    return 0;
}
