#include <stdio.h>

static int buffer[100];
static int size, head, count;

/* Adds a reading; returns 1 and sets *old when it pushed out the oldest one. */
static int push(int value, int *old) {
    int full = count == size;
    if (full) {
        *old = buffer[head];
    } else {
        count++;
    }
    buffer[head] = value;
    head++;
    if (head == size) {
        head = 0;
    }
    return full;
}

static double average(void) {
    long long total = 0;
    for (int i = 0; i < count; i++) {
        total += buffer[i];
    }
    return (double) total / count;
}

int main(void) {
    int n, value, old = 0;
    scanf("%d %d", &size, &n);
    while (n-- > 0 && scanf("%d", &value) == 1) {
        if (push(value, &old)) {
            printf("%.2f (dropped %d)\n", average(), old);
        } else {
            printf("%.2f\n", average());
        }
    }
    return 0;
}
