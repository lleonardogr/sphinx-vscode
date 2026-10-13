#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Job {
    char name[21];
    int pages;
    struct Job *next;
} Job;

static Job *head, *tail;

static void add(const char *name, int pages) {
    Job *job = malloc(sizeof *job);
    if (job == NULL) {
        exit(1);
    }
    strcpy(job->name, name);
    job->pages = pages;
    job->next = NULL;
    if (tail == NULL) {
        head = tail = job;
    } else {
        tail->next = job;
        tail = job;
    }
    printf("added %s\n", name);
}

static void remove_front(void) {
    Job *job = head;
    head = head->next;
    if (head == NULL) {
        tail = NULL;
    }
    free(job);
}

static void print_pages(int pages) {
    if (head == NULL) {
        printf("idle\n");
        return;
    }
    while (pages > 0 && head != NULL) {
        int done = pages < head->pages ? pages : head->pages;
        head->pages -= done;
        pages -= done;
        if (head->pages == 0) {
            printf("done %s\n", head->name);
            remove_front();
        }
    }
}

static void cancel(const char *name) {
    Job *previous = NULL;
    for (Job *job = head; job != NULL; previous = job, job = job->next) {
        if (strcmp(job->name, name) == 0) {
            if (previous == NULL) {
                head = job->next;
            } else {
                previous->next = job->next;
            }
            if (tail == job) {
                tail = previous;
            }
            free(job);
            printf("cancelled %s\n", name);
            return;
        }
    }
    printf("not found %s\n", name);
}

int main(void) {
    char command[16], name[21];
    int pages;
    while (scanf("%15s", command) == 1) {
        if (strcmp(command, "add") == 0) {
            scanf("%20s %d", name, &pages);
            add(name, pages);
        } else if (strcmp(command, "print") == 0) {
            scanf("%d", &pages);
            print_pages(pages);
        } else {
            scanf("%20s", name);
            cancel(name);
        }
    }
    printf("Queue:");
    if (head == NULL) {
        printf(" empty");
    }
    for (Job *job = head; job != NULL; job = job->next) {
        printf(" %s(%d)", job->name, job->pages);
    }
    printf("\n");
    while (head != NULL) {
        remove_front();
    }
    return 0;
}
