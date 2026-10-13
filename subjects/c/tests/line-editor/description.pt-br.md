# Editor de linhas

**Teste: unidades 4 a 9.** Este programa mistura strings, ponteiros, memória dinâmica, structs e listas ligadas.

Antes dos editores de tela cheia, programadores editavam arquivos uma linha por vez com **editores de linha** como o `ed`. Escreva um pequeno. O texto é uma lista de linhas, uma delas a **atual**, e os comandos trabalham na linha atual. Linhas podem ser inseridas e apagadas em qualquer lugar, e qualquer linha pode crescer, então cada linha é um nó numa **lista duplamente ligada**, com o texto numa memória do `malloc`.

```
append Dear team,
append the release is on Friday.
append Thanks!
up
insert                        (uma linha vazia, antes de "the release…")
print                           1  Dear team,
                                2>
                                3  the release is on Friday.
                                4  Thanks!
replace Friday Monday         Replaced 0
down
replace Friday Monday         Replaced 1
print                           1  Dear team,
                                2
                                3> the release is on Monday.
                                4  Thanks!
```

**Entrada**

Comandos até o fim da entrada, um por linha (no máximo 200 caracteres):

- `append TEXTO`: uma linha nova com `TEXTO` (talvez vazio) depois da linha atual; ela vira a atual.
- `insert TEXTO`: o mesmo, antes da linha atual.
- `delete`: remove a linha atual; a próxima linha vira a atual, ou a anterior se não houver próxima.
- `up`, `down`: vão para a linha anterior ou para a próxima.
- `replace VELHA NOVA`: troca cada ocorrência da palavra `VELHA` na linha atual por `NOVA` (as duas sem espaços), da esquerda para a direita, sem sobreposição.
- `print`: mostra o texto todo.

Com o buffer vazio, `append` e `insert` criam a primeira linha.

**Saída**

- `print`: cada linha como `printf("%3d%c %s\n", número, marca, texto)`, onde a marca é `>` para a linha atual e um espaço para as outras; ou `(empty)`.
- `replace`: `Replaced N`.
- `up` na primeira linha: `Error: at top`; `down` na última: `Error: at bottom`.
- `delete`, `up`, `down` ou `replace` com o buffer vazio: `Error: empty buffer`.

**Coisas para saber**

- Uma linha pode ficar maior com `replace`: aloque uma string nova do tamanho certo, preencha-a e libere a antiga.
- `strstr(texto, palavra)` acha a próxima ocorrência; continue procurando depois dela.
- Libere o texto e o nó de cada linha quando o programa terminar.
