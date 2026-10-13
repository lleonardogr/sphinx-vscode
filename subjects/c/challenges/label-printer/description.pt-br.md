# Impressora de etiquetas

Uma impressora de etiquetas imprime nomes numa caixa de largura fixa. Nomes compridos demais precisam ser cortados, e no C é cortando texto que os programas quebram: copie um nome de 100 caracteres para um array de 30 e você escreve depois do fim. A precisão do `printf` e o `snprintf` cortam texto **com segurança**.

Leia uma largura e alguns nomes e imprima-os numa caixa:

```
largura 10: +----------+
            |Ada Lov...|
            |Grace     |
            |Alan Tu...|
            +----------+
```

**Entrada**

- Linha 1: a largura (5 a 40)
- Depois um nome por linha, até o fim da entrada (0 ou mais nomes, cada um com 1 a 100 caracteres, talvez com espaços)

**Saída**

Uma borda com `+`, `width` traços e `+`; uma linha por nome entre `|` e `|`, completada com espaços até a largura; e a borda de novo. Um nome maior que a largura mostra os primeiros `width − 3` caracteres seguidos de `...`.

**Coisas para saber**

- `printf("|%-*s|", width, name)` completa até a largura; `%.*s` imprime no máximo aquela quantidade de caracteres. O `*` pega o número dos argumentos.
- `snprintf(buffer, size, "%s", name)` copia no máximo `size − 1` caracteres e sempre acrescenta o `'\0'`.
- Leia cada nome com `fgets` num array grande o bastante para 100 caracteres mais a quebra de linha e o `'\0'`, senão um nome comprido chega em dois pedaços.
