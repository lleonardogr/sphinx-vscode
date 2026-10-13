#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[21];
    int scores[3];
    double average;
} Student;

static int by_average(const void *a, const void *b) {
    const Student *x = a, *y = b;
    if (x->average != y->average) {
        return x->average < y->average ? 1 : -1;     /* highest first */
    }
    return strcmp(x->name, y->name);
}

static char grade(double average) {
    return average >= 90 ? 'A' : average >= 80 ? 'B' : average >= 70 ? 'C' : average >= 60 ? 'D' : 'F';
}

int main(void) {
    int n;
    scanf("%d", &n);
    Student *students = malloc(n * sizeof *students);
    if (students == NULL) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        Student *s = &students[i];
        scanf("%20s %d %d %d", s->name, &s->scores[0], &s->scores[1], &s->scores[2]);
        s->average = (s->scores[0] + s->scores[1] + s->scores[2]) / 3.0;
    }
    qsort(students, n, sizeof *students, by_average);
    for (int i = 0; i < n; i++) {
        printf("%2d. %-20s %6.2f %c\n", i + 1, students[i].name, students[i].average, grade(students[i].average));
    }
    free(students);
    return 0;
}
