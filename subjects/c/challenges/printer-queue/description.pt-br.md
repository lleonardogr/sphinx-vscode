# Fila de impressão

A impressora de um escritório atende os trabalhos em ordem, **o primeiro a entrar é o primeiro a sair**: uma fila. Os trabalhos entram no fim e imprimem do começo, e alguém pode cancelar um trabalho no meio. Uma lista ligada faz as três coisas barato: um ponteiro `tail` para acrescentar no fim, o `head` para imprimir, e religação para cancelar.

Processe os comandos e informe o que acontece:

```
add report 3     added report
add photo 5      added photo
print 4          done report
cancel photo     cancelled photo
print 1          idle
                 Queue: empty
```

`print 4` terminou as 3 páginas de `report` e imprimiu 1 página de `photo`, que depois foi cancelado com 4 páginas faltando.

**Entrada**

Comandos até o fim da entrada, um por linha:

- `add NOME PÁGINAS`: um trabalho (nome de 1 a 20 caracteres, 1 a 1000 páginas) entra no fim da fila;
- `print N`: a impressora imprime `N` páginas (1 a 10.000), do trabalho na frente, e depois dos seguintes;
- `cancel NOME`: remove da fila o primeiro trabalho com esse nome.

**Saída**

- `added NOME` para cada `add`;
- para `print`, `done NOME` para cada trabalho que ele termina, ou `idle` se a fila estava vazia (páginas que sobram quando a fila esvazia simplesmente se perdem);
- `cancelled NOME`, ou `not found NOME`;
- no fim, `Queue:` seguido de cada trabalho esperando como ` NOME(PÁGINAS FALTANDO)`, ou ` empty`.

**Coisas para saber**

- Guarde `head` e `tail`: acrescentar no fim é `tail->next = job; tail = job;`.
- Para remover um nó do meio, o nó anterior precisa apontar para depois dele, então guarde o nó anterior enquanto percorre.
- Libere cada trabalho quando terminar ou for cancelado, e o que sobrar no fim.
