## Em resumo

Uma função em C tem um tipo de retorno, um nome e parâmetros com tipo, como um método `static` do Java sem classe em volta. O C lê o arquivo de cima para baixo, então uma função precisa estar **declarada** antes de ser usada: ou definida acima, ou anunciada por um **protótipo**.

```c
#include <stdio.h>

int next_ticket(void);           // protótipo: definida abaixo

int main(void) {
    for (int i = 0; i < 3; i++) {
        printf("Ticket %d\n", next_ticket());   // 1, 2, 3
    }
    return 0;
}

int next_ticket(void) {
    static int last = 0;          // criada uma vez, mantém o valor entre chamadas
    last++;
    return last;
}
```

Os argumentos são **copiados** para os parâmetros: uma função que muda o parâmetro muda só a cópia dela. Para devolver um resultado, use `return`.

**Cuidado:** escreva `(void)` para "sem parâmetros". Um `()` vazio numa declaração quer dizer "parâmetros não informados" no C17, então o compilador não consegue conferir a chamada.

<!-- readings -->
