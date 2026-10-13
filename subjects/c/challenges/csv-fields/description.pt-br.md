# Campos de CSV

Planilhas exportam **CSV**, valores separados por vírgula: uma linha por registro, vírgulas entre os campos. Um campo que contém vírgula vai entre aspas duplas, e uma aspa dentro de um campo assim é escrita duas vezes. Dividir em toda vírgula quebra no primeiro nome como `"Lovelace, Ada"`, e por isso programas de verdade leem CSV caractere por caractere.

Leia linhas de CSV e imprima os campos de cada uma:

```
"Lovelace, Ada",1815,"said ""hi"""   →   3 | [Lovelace, Ada] [1815] [said "hi"]
a,,b                                 →   3 | [a] [] [b]
```

**Entrada**

Linhas de CSV, cada uma com no máximo 200 caracteres, até o fim da entrada. As aspas sempre estão bem formadas: um campo entre aspas começa com `"` logo depois de uma vírgula (ou no começo da linha), e a `"` que fecha é seguida de uma vírgula ou do fim da linha.

**Saída**

Para cada linha, o número de campos, ` |`, e cada campo entre `[` e `]`, precedido de um espaço.

**Coisas para saber**

- Uma linha vazia é um campo vazio, e `a,` tem dois campos, o segundo vazio.
- Os espaços pertencem ao campo: ` x ` continua ` x `.
- `strtok` não é permitido: ele pula campos vazios e não sabe nada de aspas.
