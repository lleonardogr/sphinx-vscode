## Por que isso importa

Você compra um disco de 1 TB, conecta num computador com Windows e ele mostra **931 GB**. Seu plano de internet promete **100 megabits**, mas os downloads nunca passam de uns **12 megabytes** por segundo. Ninguém está enganando você: são duas confusões de medida, e depois de entendê-las você sempre consegue fazer a conta sozinho.

## Dois tipos de "quilo"

No dia a dia, *quilo* quer dizer 1000: um quilômetro são 1000 metros. Esses são os **prefixos SI**, e os fabricantes de disco, as velocidades de rede e o macOS também os usam para bytes:

| Unidade | Nome | Bytes |
|---------|------|-------|
| KB | kilobyte | 1000 |
| MB | megabyte | 1000² = 1.000.000 |
| GB | gigabyte | 1000³ = 1.000.000.000 |
| TB | terabyte | 1000⁴ |

Os computadores, porém, contam em potências de 2, e 2¹⁰ = **1024** é muito perto de 1000. Por isso, durante décadas a memória também foi medida em "kilobytes" de 1024 bytes. Para evitar confusão, esses **prefixos binários** ganharam nomes próprios, com um *i*:

| Unidade | Nome | Bytes |
|---------|------|-------|
| KiB | kibibyte | 1024 |
| MiB | mebibyte | 1024² = 1.048.576 |
| GiB | gibibyte | 1024³ = 1.073.741.824 |
| TiB | tebibyte | 1024⁴ |

A memória RAM é sempre vendida em tamanhos binários: um pente de "8 GB" guarda 8 GiB.

## O caso dos gigabytes sumidos

Um disco de **1 TB** guarda 1.000.000.000.000 bytes. O Windows divide por 1024³, o que dá:

1.000.000.000.000 ÷ 1.073.741.824 ≈ **931,3**

e mostra o resultado com o rótulo "GB", embora queira dizer GiB. Nem um byte sumiu: os mesmos bytes são contados com uma unidade maior. Quanto maior o prefixo, maior a diferença: um KiB é 2,4% maior que um KB, mas um TiB é quase 10% maior que um TB.

## Convertendo entre unidades

Para achar a unidade certa de um tamanho, continue dividindo por 1000 (ou 1024) **enquanto o valor for pelo menos 1000** (ou 1024), e conte as divisões:

1.500.000 bytes ÷ 1000 = 1500 KB, ÷ 1000 = **1,5 MB** (duas divisões: M).

1.500.000 bytes ÷ 1024 = 1464,8 KiB, ÷ 1024 = **1,43 MiB**.

## Bits por segundo, bytes por arquivo

A segunda confusão é entre **bits** e **bytes**. Repare na letra maiúscula ou minúscula:

- **b** (minúsculo) é um **bit**: velocidades são em Mbps, megabits por segundo.
- **B** (maiúsculo) é um **byte**: tamanhos de arquivo são em MB, megabytes.

Como um byte tem 8 bits, divida uma velocidade por 8 para ter bytes por segundo. Uma conexão de 100 Mbps transfere no máximo 100 ÷ 8 = **12,5 MB por segundo**. Downloads reais são um pouco mais lentos, porque parte dos bits é usada para endereçar e conferir os dados.

## Quanto tempo leva um download?

Transforme tudo em bits e divida:

> tempo = tamanho em bytes × 8 ÷ velocidade em bits por segundo

Um arquivo de 700 MB tem 700 × 1.000.000 × 8 = 5.600.000.000 bits. A 100 Mbps, isso dá 5.600.000.000 ÷ 100.000.000 = **56 segundos**. Um jogo de 4 GiB tem 4 × 1.073.741.824 × 8 bits; a 50 Mbps ele leva cerca de 687 segundos, mais de 11 minutos.

## Resumo

- Os prefixos SI (KB, MB, GB, TB) multiplicam por 1000; os binários (KiB, MiB, GiB, TiB) multiplicam por 1024.
- Um disco de 1 TB mostra 931 "GB" no Windows porque o Windows divide por 1024³.
- Velocidades são em bits (b), tamanhos em bytes (B): divida uma velocidade por 8 para ter bytes por segundo.
- Tempo de download = bytes × 8 ÷ bits por segundo.
