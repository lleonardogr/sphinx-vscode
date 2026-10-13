# Quebra de linha

Editores de texto, terminais e programas de e-mail ajustam o texto a uma largura passando palavras para a linha seguinte. A regra simples, usada em quase todo lugar, é **gulosa**: ponha numa linha quantas palavras couberem e depois comece outra.

Leia uma largura e um texto e imprima o texto quebrado nessa largura:

```
largura 10:   aaa bbb ccc ddd   →   aaa bbb
                                    ccc ddd
```

`aaa bbb ccc` precisaria de 11 caracteres.

**Entrada**

- Linha 1: a largura (10 a 80)
- Depois o texto, em qualquer número de linhas, até o fim da entrada. As palavras são separadas por espaços e quebras de linha, e nenhuma palavra é maior que a largura.

**Saída**

As palavras em ordem, com um espaço entre as palavras de uma linha, cada linha o mais longa possível sem passar da largura.

**Coisas para saber**

- As quebras de linha e os espaços extras da entrada não importam: só as palavras.
- `scanf("%127s", word)` lê a próxima palavra, pulando espaços e quebras de linha, e devolve 1, ou `EOF` no fim. A largura impede que ele escreva depois do fim de `char word[128]`.
- Uma palavra cabe na linha atual quando `tamanho da linha + 1 + tamanho da palavra ≤ largura`.
