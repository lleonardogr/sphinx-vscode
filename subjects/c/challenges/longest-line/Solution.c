#include <stdio.h>
#include <stdlib.h>

/* Reads one line of any length, without its newline, into new memory.
   Returns NULL at the end of the input. The caller frees the line. */
char *read_line(void) {
    int capacity = 16, length = 0, c;
    char *line = malloc(capacity);
    if (line == NULL) {
        return NULL;
    }
    while ((c = getchar()) != EOF && c != '\n') {
        if (length + 1 == capacity) {
            capacity *= 2;
            char *bigger = realloc(line, capacity);
            if (bigger == NULL) {
                free(line);
                return NULL;
            }
            line = bigger;
        }
        line[length++] = (char) c;
    }
    if (c == EOF && length == 0) {
        free(line);
        return NULL;
    }
    line[length] = '\0';
    return line;
}

int main(void) {
    char *longest = NULL;
    size_t longest_length = 0;
    int lines = 0;
    char *line;
    while ((line = read_line()) != NULL) {
        lines++;
        size_t length = 0;
        while (line[length] != '\0') {
            length++;
        }
        if (longest == NULL || length > longest_length) {
            free(longest);
            longest = line;
            longest_length = length;
        } else {
            free(line);
        }
    }
    printf("Lines: %d\n", lines);
    if (longest != NULL) {
        printf("Longest: %zu\n%s\n", longest_length, longest);
        free(longest);
    }
    return 0;
}
