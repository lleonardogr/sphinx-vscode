#include <stdio.h>
#include <string.h>

static void swap_chars(char *a, char *b) {
    char t = *a;
    *a = *b;
    *b = t;
}

static void flip(char *first, char *last) {      /* both ends included */
    for (; first < last; first++, last--) {
        swap_chars(first, last);
    }
}

int main(void) {
    char text[256];
    while (fgets(text, sizeof text, stdin)) {
        char *newline = strchr(text, '\n');
        if (newline) {
            *newline = '\0';
        }
        /* First each word, then the whole line. */
        for (char *start = text; *start; ) {
            if (*start == ' ') {
                start++;
                continue;
            }
            char *stop = start;
            while (stop[1] != '\0' && stop[1] != ' ') {
                stop++;
            }
            flip(start, stop);
            start = stop + 1;
        }
        size_t n = strlen(text);
        if (n > 0) {
            flip(text, text + n - 1);
        }
        puts(text);
    }
    return 0;
}
