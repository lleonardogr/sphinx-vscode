# Codificador UTF-8

O **Unicode** dá a cada caractere de cada idioma um número, o seu **code point**, escrito como `U+00E9` (é) ou `U+1F600` (😀). O **UTF-8** é como a maioria dos arquivos e páginas da web guarda esses números: caracteres comuns ocupam 1 byte, outros 2, 3 ou 4.

| Code point | Bytes | Padrão de bits |
|------------|-------|----------------|
| U+0000 a U+007F | 1 | `0xxxxxxx` |
| U+0080 a U+07FF | 2 | `110xxxxx 10xxxxxx` |
| U+0800 a U+FFFF | 3 | `1110xxxx 10xxxxxx 10xxxxxx` |
| U+10000 a U+10FFFF | 4 | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

Os `x` são os bits do code point, preenchidos a partir da direita. Para é, U+00E9 = 233 = `00011 101001`, então os bytes são `110 00011` = **C3** e `10 101001` = **A9**.

Leia um code point e imprima os bytes UTF-8 dele.

**Entrada**

`U+` seguido de 4 a 6 dígitos hex (maiúsculos), de U+0000 a U+10FFFF.

**Saída**

Os bytes em hex, com dois dígitos maiúsculos cada, separados por espaços.

**O que você precisa saber**

- `Integer.parseInt(texto.substring(2), 16)` lê o code point.
- Cada byte de continuação guarda 6 bits: `0x80 + code % 64`, depois `code /= 64`. O primeiro byte recebe a marca (`0xC0`, `0xE0` ou `0xF0`) mais os bits que sobraram.
- Monte os bytes você mesmo: `getBytes` e outros codificadores prontos não valem aqui.
