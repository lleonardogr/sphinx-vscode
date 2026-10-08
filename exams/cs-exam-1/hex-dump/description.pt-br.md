# Despejo hexadecimal

Quando um arquivo não abre, programadores olham seus bytes com um **hex dump** (despejo hexadecimal), feito por ferramentas como `xxd` e `hexdump`. Cada linha mostra 16 bytes em hexadecimal e, ao lado, os mesmos bytes como texto, para você achar tanto números quanto palavras:

```
0000  48 69 20 53 70 68 69 6E 78 0A                    Hi Sphinx.
```

Leia alguns bytes e imprima o hex dump deles. Cada linha tem:

1. o **deslocamento**: a posição do primeiro byte da linha, com 4 dígitos hexadecimais maiúsculos (`0000`, `0010`, `0020`…);
2. dois espaços;
3. até 16 bytes em hexadecimal de 2 dígitos maiúsculos, separados por um espaço. Essa parte tem sempre **47 caracteres** de largura: numa última linha curta, complete o resto com espaços;
4. dois espaços;
5. os mesmos bytes como texto: os bytes de 32 a 126 como o caractere ASCII deles, e qualquer outro byte como `.`.

**Entrada**

A quantidade `n` (1 a 100), depois uma linha com `n` bytes em decimal (0 a 255), separados por espaços.

**Saída**

Uma linha a cada 16 bytes, como acima.

**Para saber**

- O byte 72 é `48` em hexadecimal (4 × 16 + 8) e a letra `H` em ASCII; `(char) 72` dá `'H'`.
- 16 bytes ocupam 16 × 3 − 1 = 47 caracteres na parte hexadecimal.
