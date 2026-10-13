# Desfazer e refazer

Todo editor tem **desfazer** e **refazer**. O histórico é uma lista que dá para percorrer nos dois sentidos, que no C é uma **lista duplamente ligada**: cada nó aponta para o próximo e de volta para o anterior. Um ponteiro marca onde você está; desfazer e refazer só o movem. Digitar algo novo depois de um desfazer joga fora os passos que poderiam ser refeitos.

O editor aqui digita palavras inteiras. Processe os comandos:

```
type Hello
type big
type world
undo
show        Hello big
redo
show        Hello big world
```

**Entrada**

Comandos até o fim da entrada, um por linha: `type PALAVRA` (1 a 30 caracteres, sem espaços), `undo`, `redo` ou `show`.

**Saída**

- `show` imprime o documento, com as palavras separadas por um espaço, ou `(empty)`;
- `undo` sem nada para desfazer imprime `nothing to undo`, e `redo` sem nada para refazer imprime `nothing to redo`;
- os outros comandos não imprimem nada.

**Coisas para saber**

- Um nó por palavra digitada, com `prev` e `next`, e um ponteiro para a última palavra do documento (`NULL`, ou um nó sentinela, para um documento vazio).
- `undo` move o ponteiro para trás, `redo` para a frente. As palavras depois do ponteiro continuam na lista até algo novo ser digitado.
- `type` depois de um `undo` precisa liberar os nós depois do ponteiro antes de acrescentar a palavra nova.
