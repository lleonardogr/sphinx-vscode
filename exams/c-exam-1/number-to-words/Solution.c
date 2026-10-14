#include <stdio.h>
#include <string.h>

static const char *small(int n) {
    switch (n) {
        case 1: return "one";        case 2: return "two";        case 3: return "three";
        case 4: return "four";       case 5: return "five";       case 6: return "six";
        case 7: return "seven";      case 8: return "eight";      case 9: return "nine";
        case 10: return "ten";       case 11: return "eleven";    case 12: return "twelve";
        case 13: return "thirteen";  case 14: return "fourteen";  case 15: return "fifteen";
        case 16: return "sixteen";   case 17: return "seventeen"; case 18: return "eighteen";
        default: return "nineteen";
    }
}

static const char *tens(int n) {
    switch (n) {
        case 2: return "twenty";  case 3: return "thirty";  case 4: return "forty";
        case 5: return "fifty";   case 6: return "sixty";   case 7: return "seventy";
        case 8: return "eighty";  default: return "ninety";
    }
}

/* Appends the words for 1 to 999 to out, with a space before them when out isn't empty. */
static void below_thousand(int n, char *out) {
    char part[64] = "";
    if (n >= 100) {
        snprintf(part, sizeof part, "%s hundred", small(n / 100));
        n %= 100;
        if (n > 0) {
            strcat(part, " ");
        }
    }
    if (n >= 20) {
        strcat(part, tens(n / 10));
        if (n % 10 > 0) {
            strcat(part, "-");
            strcat(part, small(n % 10));
        }
    } else if (n > 0) {
        strcat(part, small(n));
    }
    if (out[0] != '\0') {
        strcat(out, " ");
    }
    strcat(out, part);
}

int main(void) {
    int n;
    while (scanf("%d", &n) == 1) {
        char words[256] = "";
        if (n == 0) {
            strcpy(words, "zero");
        } else {
            if (n >= 1000) {
                below_thousand(n / 1000, words);
                strcat(words, " thousand");
            }
            if (n % 1000 > 0) {
                below_thousand(n % 1000, words);
            }
        }
        printf("%s\n", words);
    }
    return 0;
}
