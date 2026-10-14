#include <stdio.h>

int main(void) {
    int t;
    scanf("%d", &t);
    for (int i = 0; i < t; i++) {
        int seconds;
        scanf("%d", &seconds);
        int hours = seconds / 3600;
        int minutes = seconds / 60 % 60;
        int secs = seconds % 60;
        const char *half = hours < 12 ? "AM" : "PM";
        int shown = hours % 12 == 0 ? 12 : hours % 12;
        printf("%02d:%02d:%02d %s\n", shown, minutes, secs, half);
    }
    return 0;
}
