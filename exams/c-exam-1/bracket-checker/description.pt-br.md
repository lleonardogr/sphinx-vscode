# Verificador de parênteses

Editores de código sublinham um parêntese que nunca é fechado, ou é fechado pelo tipo errado. Confira cada linha da entrada e informe o primeiro problema com `(`, `)`, `[`, `]`, `{` e `}`:

```
if (a[i] == b) { return; }   →   OK
int x = (1 + 2];             →   Error at column 15: expected ')' but found ']'
f(g(h())                     →   Error at end: '(' from column 2 is not closed
}                            →   Error at column 1: unexpected '}'
```

**Entrada**

Linhas de texto, com no máximo 200 caracteres cada, até o fim da entrada. Todo caractere que não seja um dos seis é ignorado, mesmo entre aspas.

**Saída**

Para cada linha, uma destas:

- `OK`;
- `Error at column C: unexpected 'X'`, para um de fechamento quando nada está aberto;
- `Error at column C: expected 'X' but found 'Y'`, para um de fechamento que não combina com o último aberto;
- `Error at end: 'X' from column C is not closed`, quando a linha termina com parênteses ainda abertos (informe o último aberto).

As colunas contam a partir de 1. Informe só o primeiro erro de cada linha.

**Coisas para saber**

- Um array com um índice funciona como **pilha**: empilhe um de abertura e compare um de fechamento com o topo.
- Guarde a coluna de cada um de abertura junto dele.
