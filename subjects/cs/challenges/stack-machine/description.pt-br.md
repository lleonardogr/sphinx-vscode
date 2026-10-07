# Máquina de pilha

Quando você roda um programa Java, a JVM não usa registradores com nome: ela calcula numa **pilha**. O bytecode de `(3 + 4) * 2` é mais ou menos *empilha 3, empilha 4, soma, empilha 2, multiplica*: cada operação tira os valores do topo da pilha e coloca o resultado de volta.

Escreva uma pequena máquina de pilha. A pilha começa vazia, e as instruções são:

| Instrução | O que faz |
|-----------|-----------|
| `PUSH n` | coloca o número n no topo |
| `ADD`, `SUB`, `MUL` | tira o valor do topo b, depois o próximo valor a, e empilha a + b, a − b ou a × b |
| `DUP` | empilha uma cópia do valor do topo |
| `PRINT` | tira o valor do topo e o imprime |

Então `PUSH 10`, `PUSH 3`, `SUB` deixa **7**: o valor da direita fica no topo.

**Entrada**

O número de instruções `n` (1 ≤ n ≤ 50), depois uma instrução por linha. Os números são inteiros, de −1.000.000 a 1.000.000.

**Saída**

O que o `PRINT` imprime, um número por linha. Depois da última instrução, `Stack: ` seguido dos valores que sobraram, de baixo para cima e separados por espaços, ou `Stack: empty`.

Se uma instrução precisar de mais valores do que a pilha tem, imprima `Error at line K: stack underflow` e pare. Para uma instrução que não está na tabela, imprima `Error at line K: unknown instruction` e pare (as linhas contam a partir de 1).

**O que você precisa saber**

- Um array e um contador formam uma pilha: `stack[top++] = valor` empilha, `stack[--top]` desempilha.
- Use `long`: multiplicar pode ir muito além do que cabe num `int`.
- Desempilhe **b** primeiro, depois **a**: a ordem importa no `SUB`.
