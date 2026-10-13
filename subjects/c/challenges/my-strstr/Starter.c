#include <stdio.h>
#include <string.h>

// TODO: write const char *find(const char *text, const char *word), which returns
// a pointer to the first match in text, or NULL

int main(void) {
    char word[64], line[256];
    fgets(word, sizeof word, stdin);
    word[strcspn(word, "\n")] = '\0';

    // TODO: for each line, print its number and the position of every match

    return 0;
}
