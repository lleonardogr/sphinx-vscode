#include <stdio.h>
#include <string.h>

/* A pointer to the first place in text where word starts, or NULL. */
const char *find(const char *text, const char *word) {
    for (; *text != '\0'; text++) {
        const char *t = text, *w = word;
        while (*w != '\0' && *t == *w) {
            t++;
            w++;
        }
        if (*w == '\0') {
            return text;
        }
    }
    return NULL;
}

int main(void) {
    char word[64], line[256];
    fgets(word, sizeof word, stdin);
    word[strcspn(word, "\r\n")] = '\0';
    int number = 0;
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\r\n")] = '\0';
        number++;
        printf("%d:", number);
        int found = 0;
        for (const char *p = find(line, word); p != NULL; p = find(p + 1, word)) {
            printf(" %td", p - line);
            found = 1;
        }
        printf(found ? "\n" : " none\n");
    }
    return 0;
}
