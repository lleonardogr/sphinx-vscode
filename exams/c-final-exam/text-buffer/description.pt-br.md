# Buffer de texto

Todo editor de texto guarda o documento num **buffer** que cresce conforme você digita e se fecha quando você apaga. Escreva um: um bloco de memória do `malloc` que cresce com `realloc`, e comandos que inserem e apagam em qualquer lugar.

```
append Hello
append World
insert 5 -
print             [Hello-World] (11)
delete 0 6
print             [World] (5)
```

O texto começa logo depois do espaço único que segue o comando (ou a posição) e é usado exatamente como está: `append  x` com dois espaços acrescenta ` x`.

**Entrada**

Comandos até o fim da entrada, um por linha (no máximo 200 caracteres):

- `append TEXTO`: acrescenta `TEXTO` (talvez vazio, talvez com espaços) no fim;
- `insert POS TEXTO`: insere `TEXTO` antes da posição `POS` (0 é o começo, o tamanho é o fim);
- `delete POS QTD`: remove `QTD` caracteres a partir de `POS`;
- `print`: mostra o texto.

O texto pode passar de 100.000 caracteres.

**Saída**

- `print`: o texto entre `[` e `]`, um espaço e o tamanho entre parênteses: `[Hello-World] (11)`.
- `insert` ou `delete` com uma posição fora do texto: `Error: position out of range`, e o texto não muda.

**Coisas para saber**

- `memmove(destino, origem, n)` copia bytes mesmo quando as duas regiões se sobrepõem, que é o que abrir ou fechar um espaço precisa.
- Guarde o tamanho você mesmo em vez de chamar `strlen` num texto longo toda vez.
- Libere o buffer no fim.
