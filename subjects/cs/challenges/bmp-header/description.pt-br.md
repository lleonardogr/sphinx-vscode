# Lendo o cabeçalho de um BMP

Arquivos começam com um **cabeçalho**: alguns bytes que dizem que tipo de arquivo é e como lê-lo. Uma imagem **BMP** começa assim:

| Bytes | Significado |
|-------|-------------|
| 0–1 | as letras `BM` (`42 4D` em hex) |
| 2–5 | o tamanho do arquivo em bytes |
| 18–21 | a largura em pixels |
| 22–25 | a altura em pixels |
| 28–29 | os bits por pixel |

Números que ocupam vários bytes são guardados em **little-endian**: o byte **menos** significativo vem primeiro. Os bytes da largura `80 02 00 00` querem dizer 0x00000280 = **640**, não 0x80020000. Os processadores Intel e ARM funcionam do mesmo jeito, enquanto os protocolos de rede mandam o byte mais significativo primeiro (big-endian).

Leia os primeiros 30 bytes de um arquivo e descreva a imagem.

**Entrada**

Uma linha com 30 bytes em hex (dois dígitos maiúsculos cada), separados por espaços.

**Saída**

Cinco linhas: `Format: BMP`, depois `Width: `, `Height: ` e `Bits per pixel: ` com seus valores, depois `File size: N bytes`. Se o arquivo não começar com `BM`, imprima só `Not a BMP file`.

**O que você precisa saber**

- `Integer.parseInt("4E", 16)` lê um byte.
- Little-endian: os bytes b0 b1 b2 b3 são b0 + b1 × 256 + b2 × 256² + b3 × 256³. Use `long` para o tamanho do arquivo.
- Leia os bytes você mesmo: `ByteBuffer` e bibliotecas de imagem não valem aqui.
