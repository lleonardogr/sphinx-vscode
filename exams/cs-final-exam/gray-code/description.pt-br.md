# Código Gray

Um botão de volume ou a roda de um robô informa sua posição com um anel de contatos, lidos como bits. Com o binário normal, ir de 3 (`011`) para 4 (`100`) muda **três** bits de uma vez. Eles nunca mudam exatamente no mesmo instante, então por um momento o sensor pode ler `111` ou `000`: um salto absurdo. O **código Gray** numera as posições de forma que **só um bit muda** entre vizinhos.

A lista de códigos Gray de n bits é montada a partir da lista de (n − 1) bits: primeiro a lista com `0` na frente, depois a **mesma lista invertida** com `1` na frente.

| Bits | Códigos Gray, a partir da posição 0 |
|---|---|
| 1 | `0` `1` |
| 2 | `00` `01` `11` `10` |
| 3 | `000` `001` `011` `010` `110` `111` `101` `100` |

Então com 3 bits a leitura `110` quer dizer a posição 4. A lista também dá a volta: do último código de volta para o primeiro, só um bit muda também.

Leia as leituras de um sensor e imprima a posição de cada uma. Depois conte as **falhas**: leituras seguidas que diferem em mais de um bit, o que um sensor de verdade não consegue produzir. Duas leituras iguais (o botão não se mexeu) não são falha.

**Entrada**

Três linhas: o número de bits `n` (1 a 16), a quantidade `k` (1 a 20) e `k` leituras de `n` bits cada, separadas por espaços.

**Saída**

Uma linha por leitura, como `110 -> 4`, depois `Glitches: G`.

**Para saber**

- Uma lista de strings pode ser montada com `ArrayList<String>` ou com arrays de tamanho `2^n`.
- `a.charAt(i) != b.charAt(i)` compara duas leituras bit a bit.
