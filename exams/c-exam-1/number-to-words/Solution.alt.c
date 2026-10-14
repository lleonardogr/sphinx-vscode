#include <stdio.h>

static const char *ONES[] = {"", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                             "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"};
static const char *TENS[] = {"", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"};

/* Prints the words for n (1 to 999999), recursively; `first` says whether nothing was printed yet. */
static void say(int n, int first) {
    if (n >= 1000) {
        say(n / 1000, first);
        printf(" thousand");
        if (n % 1000) {
            say(n % 1000, 0);
        }
        return;
    }
    if (!first) {
        putchar(' ');
    }
    if (n >= 100) {
        printf("%s hundred", ONES[n / 100]);
        if (n % 100) {
            say(n % 100, 0);
        }
    } else if (n >= 20) {
        printf("%s", TENS[n / 10]);
        if (n % 10) {
            printf("-%s", ONES[n % 10]);
        }
    } else {
        printf("%s", ONES[n]);
    }
}

int main(void) {
    int n;
    while (scanf("%d", &n) == 1) {
        if (n == 0) {
            printf("zero");
        } else {
            say(n, 1);
        }
        printf("\n");
    }
    return 0;
}
