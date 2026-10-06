## Por que o hexadecimal existe

O binário é o que o computador usa, mas ele é longo e fácil de ler errado: o número 200 é `11001000`. Os programadores precisavam de um jeito mais curto de escrever os mesmos bits, e o **hexadecimal** (base 16, "hex" para os íntimos) é esse jeito. Cada dígito hex representa **exatamente 4 bits**, então um byte (8 bits) é sempre **dois** dígitos hex.

Você vai ver hex por todo lado:

- **Cores** na web: `#FF8800` é vermelho 255, verde 136, azul 0.
- **Endereços de memória** e valores de bytes em mensagens de erro: `0x7F`.
- Caracteres **Unicode**: `U+00E9` é "é".

## Os 16 dígitos

A base 16 precisa de 16 dígitos, mas só temos dez (0 a 9). Então o hex pega letras emprestadas: **A = 10, B = 11, C = 12, D = 13, E = 14, F = 15**. Maiúsculas ou minúsculas valem o mesmo.

| Hex | Decimal | Binário | | Hex | Decimal | Binário |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0000 | | 8 | 8 | 1000 |
| 1 | 1 | 0001 | | 9 | 9 | 1001 |
| 2 | 2 | 0010 | | A | 10 | 1010 |
| 3 | 3 | 0011 | | B | 11 | 1011 |
| 4 | 4 | 0100 | | C | 12 | 1100 |
| 5 | 5 | 0101 | | D | 13 | 1101 |
| 6 | 6 | 0110 | | E | 14 | 1110 |
| 7 | 7 | 0111 | | F | 15 | 1111 |

Um grupo de 4 bits se chama **nibble**: meio byte.

## Do hex para o decimal

Os valores das posições funcionam como sempre, agora com potências de 16: 1, 16, 256, 4096…

- **2F₁₆** = 2 × 16 + 15 × 1 = 32 + 15 = **47**
- **1A3₁₆** = 1 × 256 + 10 × 16 + 3 × 1 = 256 + 160 + 3 = **419**
- **FF₁₆** = 15 × 16 + 15 = **255**, o maior valor de um byte

## Binário e hex: grupos de quatro

Converter entre binário e hex é fácil porque 16 = 2⁴. **Separe os bits em grupos de 4, começando pela direita**, e troque cada grupo pelo seu dígito hex:

- `1011 0010` → B e 2 → **B2₁₆**
- `11 1110` → complete com zeros à esquerda: `0011 1110` → **3E₁₆**

E o caminho de volta: cada dígito hex vira 4 bits. `C4₁₆` → `1100 0100`.

## Do decimal para o hex

Divida por 16 repetidamente e leia os restos do último para o primeiro, como você fez com 2. Restos de 10 a 15 viram A a F:

| Divisão | Quociente | Resto |
|:---:|:---:|:---:|
| 419 ÷ 16 | 26 | **3** |
| 26 ÷ 16 | 1 | **10 → A** |
| 1 ÷ 16 | 0 | **1** |

Lendo de baixo para cima: 419 = **1A3₁₆**.

## Octal: base 8

O octal usa os dígitos de 0 a 7, e cada dígito representa **3 bits**. Ele é menos comum hoje, mas você ainda encontra nas **permissões de arquivos do Unix**: `chmod 755` quer dizer rwx (7 = 111), r-x (5 = 101), r-x (5 = 101).

## Erros comuns

- **Ler `0x10` como dez.** Vale 16: um dezesseis e zero unidades.
- **Agrupar os bits pela esquerda.** Agrupe sempre pela direita e complete o grupo da esquerda com zeros.
- **Zeros à esquerda no Java.** No Java, um número que começa com `0` é **octal**: `int x = 010;` guarda 8, não 10. Nunca complete números decimais com zeros no código.

## No Java

```java
int color = 0xFF8800;      // literal hexadecimal
int mode = 0755;           // literal octal (zero à esquerda!)
IO.println(0x2F);          // 47
IO.println(Integer.toHexString(255)); // ff
```

`System.out.printf("%X", 255)` imprime `FF`. Nos desafios você vai escrever essas conversões você mesmo.

## Termos importantes

- **Hexadecimal (hex)**: base 16, dígitos 0–9 e A–F.
- **Nibble**: 4 bits, um dígito hex.
- **Octal**: base 8, dígitos 0–7, 3 bits por dígito.
- **Prefixo**: como o código marca a base: `0b` binário, `0x` hex, um `0` à esquerda octal no Java.
