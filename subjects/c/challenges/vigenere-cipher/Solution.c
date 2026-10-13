#include <stdio.h>
#include <string.h>
#include <ctype.h>

static void read_line(char *buffer, int size) {
    if (fgets(buffer, size, stdin) == NULL) {
        buffer[0] = '\0';
    }
    buffer[strcspn(buffer, "\r\n")] = '\0';
}

int main(void) {
    char mode[16], key[64], text[256];
    read_line(mode, sizeof mode);
    read_line(key, sizeof key);
    read_line(text, sizeof text);
    int decrypt = strcmp(mode, "decrypt") == 0;
    int key_length = strlen(key);
    int k = 0;
    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (isalpha((unsigned char) c)) {
            int shift = tolower((unsigned char) key[k % key_length]) - 'a';
            if (decrypt) {
                shift = 26 - shift;
            }
            char base = isupper((unsigned char) c) ? 'A' : 'a';
            text[i] = base + (c - base + shift) % 26;
            k++;
        }
    }
    printf("%s\n", text);
    return 0;
}
