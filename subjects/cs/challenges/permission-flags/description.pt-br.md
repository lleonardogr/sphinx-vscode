# Flags de permissão

No Linux e no macOS cada arquivo tem permissões para o **dono**, o **grupo** e **todos os outros**. Cada um dos três tem três flags: leitura (**r**ead), escrita (**w**rite) e execução (e**x**ecute). Elas são escritas como 9 letras, como `rwxr-xr--`, ou como 3 dígitos octais, como `754`.

Cada dígito são 3 bits, um por flag: leitura vale **4**, escrita **2** e execução **1**. Então 7 = 4 + 2 + 1 = `rwx`, 5 = 4 + 1 = `r-x` e 4 = `r--`.

Leia permissões numa forma e imprima-as na outra.

**Entrada**

Ou 3 dígitos (de `0` a `7` cada), ou 9 caracteres em que as posições 1, 4 e 7 são `r` ou `-`, as posições 2, 5 e 8 são `w` ou `-`, e as posições 3, 6 e 9 são `x` ou `-`.

**Saída**

As mesmas permissões na outra forma, ou `Invalid` se a entrada não seguir essas regras.

**O que você precisa saber**

- Uma flag é um único bit, e `digito & 4` testa o bit de leitura: não é 0 quando a flag está ligada.
- `|` liga bits: `digito = digito | 2` liga a flag de escrita.
- `"rwx".charAt(i % 3)` dá a letra esperada na posição `i`.
