#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef struct Tree {
    char word[51];
    int count;
    struct Tree *left, *right;
} Tree;

static Tree *insert(Tree *node, const char *word, int *distinct) {
    if (node == NULL) {
        node = calloc(1, sizeof *node);
        if (node == NULL) {
            exit(1);
        }
        strcpy(node->word, word);
        node->count = 1;
        (*distinct)++;
        return node;
    }
    int order = strcmp(word, node->word);
    if (order < 0) {
        node->left = insert(node->left, word, distinct);
    } else if (order > 0) {
        node->right = insert(node->right, word, distinct);
    } else {
        node->count++;
    }
    return node;
}

static void print_in_order(const Tree *node) {
    if (node != NULL) {
        print_in_order(node->left);
        printf("%s %d\n", node->word, node->count);
        print_in_order(node->right);
    }
}

static int height(const Tree *node) {
    if (node == NULL) {
        return 0;
    }
    int l = height(node->left), r = height(node->right);
    return 1 + (l > r ? l : r);
}

static void destroy(Tree *node) {
    if (node != NULL) {
        destroy(node->left);
        destroy(node->right);
        free(node);
    }
}

int main(void) {
    Tree *root = NULL;
    char word[51];
    int length = 0, total = 0, distinct = 0, c;
    do {
        c = getchar();
        if (c != EOF && isalpha(c)) {
            if (length < 50) {
                word[length++] = (char) tolower(c);
            }
        } else if (length > 0) {
            word[length] = '\0';
            root = insert(root, word, &distinct);
            total++;
            length = 0;
        }
    } while (c != EOF);
    print_in_order(root);
    printf("Total: %d\nDistinct: %d\nHeight: %d\n", total, distinct, height(root));
    destroy(root);
    return 0;
}
