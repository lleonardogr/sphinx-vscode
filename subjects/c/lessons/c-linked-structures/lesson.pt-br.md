## Em resumo

Uma **lista ligada** é uma corrente de nós alocados um por um, cada um com um valor e um ponteiro para o próximo nó; o último aponta para `NULL`. Acrescentar ou remover um nó só muda alguns ponteiros, por mais longa que a lista seja.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push(Node *head, int value) {
    Node *n = malloc(sizeof *n);
    if (n == NULL) exit(1);
    n->value = value;
    n->next = head;
    return n;
}

int main(void) {
    Node *head = NULL;
    for (int i = 1; i <= 3; i++) head = push(head, i);
    for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->value);
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
```

Com um ponteiro `prev` também, a lista é **duplamente ligada**; com `left` e `right`, os nós formam uma **árvore**.

**Cuidado:** guarde `head->next` antes do `free(head)`: depois do free, o nó não pode ser lido.

<!-- readings -->
