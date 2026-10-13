#include <stdio.h>
#include <string.h>

int main(void) {
    char text[256] = "";
    char longest[256] = "-";
    fgets(text, sizeof text, stdin);
    char *newline = strchr(text, '\n');
    if (newline != NULL) {
        *newline = '\0';
    }
    size_t characters = strlen(text);
    int count = 0;
    for (char *word = strtok(text, " "); word != NULL; word = strtok(NULL, " ")) {
        if (count == 0 || strlen(word) > strlen(longest)) {
            strcpy(longest, word);
        }
        count++;
    }
    printf("Characters: %zu\nWords: %d\nLongest: %s\n", characters, count, longest);
    return 0;
}
