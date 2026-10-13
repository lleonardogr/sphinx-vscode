# Achar todas as ocorrências

O "Localizar" de todo editor faz a mesma coisa: procurar uma palavra dentro de um texto. O `strstr` da biblioteca do C devolve um **ponteiro** para onde a palavra começa dentro do texto, ou `NULL` quando ela não está lá. Escreva o seu e use-o para achar todas as ocorrências em cada linha.

```
palavra: cat
the cat sat on the cat mat   →   1: 4 19
dog                          →   2: none
```

As ocorrências podem se sobrepor: em `aaaa`, `aa` é achado em 0, 1 e 2.

**Entrada**

- Linha 1: a palavra a procurar (1 a 50 caracteres, talvez com espaços)
- Depois linhas de texto (no máximo 200 caracteres cada), até o fim da entrada

**Saída**

Para cada linha de texto, o número dela (a partir de 1), `:`, e a posição de cada ocorrência (a partir de 0), cada uma depois de um espaço, ou ` none`.

**Coisas para saber**

- Escreva `const char *find(const char *text, const char *word)` (ou com `char *`), devolvendo um ponteiro dentro de `text` ou `NULL`.
- A posição de uma ocorrência é `p - line`: subtrair dois ponteiros para o mesmo array dá a distância entre eles. Imprima com `%td`.
- Para achar a próxima ocorrência, procure de novo a partir de `p + 1`.
- A busca diferencia maiúsculas de minúsculas, e `strstr`, `strncmp` e parentes não são permitidos.
