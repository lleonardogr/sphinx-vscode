## Em resumo

Um **bit** é 0 ou 1, e um **byte** são 8 bits. Cada bit a mais dobra as possibilidades, então **n bits têm 2ⁿ valores**, de 0 a 2ⁿ − 1: um byte guarda de 0 a 255. No sentido contrário, um número precisa de tantos bits quantas vezes dá para dividi-lo ao meio até chegar a 0: 300 precisa de 9.

![Cada bit a mais dobra os padrões: 2, 4, 8](bit-patterns.svg)

Os tamanhos usam dois tipos de prefixo. Os **prefixos SI** multiplicam por 1000: 1 KB = 1000 bytes, 1 MB = 1000² bytes. Os **prefixos binários** multiplicam por 1024: 1 KiB = 1024 bytes, 1 MiB = 1024² bytes. É por isso que um disco de 1 TB aparece com 931 "GB" no Windows: os mesmos bytes divididos por 1024³.

Velocidades são em **bits** por segundo (Mbps, b minúsculo) e arquivos em **bytes** (MB, B maiúsculo): uma conexão de 100 Mbps transfere no máximo 12,5 MB por segundo.

Um número maior que 255 ocupa vários bytes, e eles podem ser guardados em duas ordens. O **big-endian** coloca o byte mais significativo primeiro, como escrevemos os números; o **little-endian** coloca o menos significativo primeiro. Os processadores Intel e ARM e muitos formatos de arquivo são little-endian; os protocolos de rede são big-endian.

| 300 = 0x012C | 1º byte | 2º byte |
|--------------|---------|---------|
| big-endian | `01` | `2C` |
| little-endian | `2C` | `01` |

<!-- readings -->

## Verifique

1. Quantos valores 10 bits guardam, e quantos bits o 1000 precisa?
2. Quantos bytes há em 2 MiB, e em 2 MB?
3. Que número os bytes little-endian `E8 03` guardam?
