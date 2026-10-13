#include <stdio.h>
#include <string.h>

static int letter_offset(char c) {
    if (c >= 'a' && c <= 'z') return c - 'a';
    if (c >= 'A' && c <= 'Z') return c - 'A';
    return -1;
}

int main(void) {
    char mode[16] = "", key[64] = "", text[256] = "";
    fgets(mode, sizeof mode, stdin);
    fgets(key, sizeof key, stdin);
    fgets(text, sizeof text, stdin);
    key[strcspn(key, "\r\n")] = '\0';
    int sign = mode[0] == 'd' ? -1 : 1;
    size_t used = 0, n = strlen(key);
    for (size_t i = 0; i < strlen(text); i++) {
        int offset = letter_offset(text[i]);
        if (offset < 0) {
            continue;
        }
        int shift = letter_offset(key[used++ % n]) * sign;
        char first = text[i] >= 'a' ? 'a' : 'A';
        text[i] = (char) (first + ((offset + shift) % 26 + 26) % 26);
    }
    fputs(text, stdout);
    if (strchr(text, '\n') == NULL) {
        putchar('\n');
    }
    return 0;
}
