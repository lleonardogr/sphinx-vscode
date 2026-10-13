#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct node {
    char *word;                 /* exactly as long as needed */
    int count;
    struct node *left, *right;
};

/* Iterative insert: walk a pointer to the link where the word belongs. */
static int add(struct node **root, const char *word) {
    struct node **link = root;
    while (*link) {
        int c = strcmp(word, (*link)->word);
        if (c == 0) {
            (*link)->count++;
            return 0;
        }
        link = c < 0 ? &(*link)->left : &(*link)->right;
    }
    struct node *n = malloc(sizeof *n);
    char *copy = malloc(strlen(word) + 1);
    if (!n || !copy) exit(1);
    strcpy(copy, word);
    n->word = copy;
    n->count = 1;
    n->left = n->right = NULL;
    *link = n;
    return 1;
}

static int walk(struct node *n, int depth) {      /* prints, frees, returns the height */
    if (!n) return depth;
    int l = walk(n->left, depth + 1);
    printf("%s %d\n", n->word, n->count);
    int r = walk(n->right, depth + 1);
    free(n->word);
    free(n);
    return l > r ? l : r;
}

int main(void) {
    struct node *root = NULL;
    char buf[64];
    int len = 0, total = 0, distinct = 0;
    for (int c = getchar(); ; c = getchar()) {
        int letter = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
        if (letter) {
            if (len < 50) buf[len++] = (char) (c | 0x20);     /* lowercase: set bit 5 */
            continue;
        }
        if (len) {
            buf[len] = '\0';
            distinct += add(&root, buf);
            total++;
            len = 0;
        }
        if (c == EOF) break;
    }
    int h = walk(root, 0);
    printf("Total: %d\nDistinct: %d\nHeight: %d\n", total, distinct, h);
    return 0;
}
