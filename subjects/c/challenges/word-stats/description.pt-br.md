# Estatísticas de palavras

Todo editor de texto mostra a contagem de palavras, e cada um precisa decidir o que é uma "palavra". Aqui, como na maioria deles, uma palavra é uma sequência de caracteres sem espaços, então `C   is fun` tem 3 palavras, quantos espaços houver entre elas.

Leia uma linha e imprima o tamanho dela, o número de palavras e a palavra mais longa:

```
the quick brown fox   →   Characters: 19
                          Words: 4
                          Longest: quick
```

**Entrada**

Uma linha de texto, com no máximo 200 caracteres, com as palavras separadas por um ou mais espaços (e talvez espaços no começo ou no fim).

**Saída**

- `Characters: ` e o tamanho da linha, com os espaços, sem a quebra de linha;
- `Words: ` e o número de palavras;
- `Longest: ` e a palavra mais longa (a primeira, se várias empatarem), ou `-` quando não há palavras.

**Coisas para saber**

- `fgets(line, sizeof line, stdin)` lê a linha inteira, com os espaços, e mantém a quebra de linha: corte-a com `line[strcspn(line, "\n")] = '\0';`. A última linha da entrada pode não ter quebra de linha.
- Uma string termina no `'\0'`: repita enquanto `line[i] != '\0'`.
- `printf("%.*s", n, &line[i])` imprime `n` caracteres a partir do índice `i`.
