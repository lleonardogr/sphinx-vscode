# Linha mais longa

O `fgets` precisa de um buffer, e qualquer tamanho que você escolher é um palpite: um arquivo de log ou uma página web minificada podem ter linhas de 100.000 caracteres. Programas robustos em C leem uma linha numa memória que **cresce** até a quebra de linha chegar, que é o que a função POSIX `getline` faz.

Escreva `char *read_line(void)`, que lê uma linha de qualquer tamanho numa memória nova e a devolve (ou `NULL` no fim da entrada), e use-a para achar a linha mais longa:

```
short
a bit longer      →   Lines: 3
mid                   Longest: 12
                      a bit longer
```

**Entrada**

Linhas de texto até o fim da entrada, cada uma com até 100.000 caracteres. A última linha pode não ter quebra de linha.

**Saída**

`Lines: ` e o número de linhas; depois, se houve pelo menos uma linha, `Longest: ` e o tamanho dela, e a própria linha mais longa (a primeira, se várias empatarem).

**Coisas para saber**

- Leia com `getchar()` num bloco do `malloc` e dobre-o com `realloc` quando encher, deixando espaço para o `'\0'`.
- `read_line` devolve memória que dura mais que ela, então quem chama precisa dar `free` em cada linha que recebe.
- `fgets`, `getline` e `scanf` não são permitidos, nem arrays fixos grandes: a graça é o buffer que cresce.
