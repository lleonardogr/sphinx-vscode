# Tempo de download

Leia o tamanho de um arquivo e a velocidade de uma conexão de internet, e imprima quanto tempo o download leva.

Tamanhos são medidos em **bytes** (B), mas velocidades de conexão em **bits** por segundo (bps), e um byte tem 8 bits. Um arquivo de 700 MB tem 700 × 1.000.000 × 8 = 5.600.000.000 bits; a 100 Mbps (100.000.000 bits por segundo) ele leva **56 segundos**.

| Unidades de tamanho | Bytes | Unidades de velocidade | Bits por segundo |
|---------------------|-------|------------------------|------------------|
| `B` | 1 | `bps` | 1 |
| `KB`, `MB`, `GB`, `TB` | 1000, 1000², 1000³, 1000⁴ | `Kbps` | 1000 |
| `KiB`, `MiB`, `GiB`, `TiB` | 1024, 1024², 1024³, 1024⁴ | `Mbps` | 1000² |
| | | `Gbps` | 1000³ |

**Entrada**

Duas linhas. A primeira é o tamanho: um número inteiro (0 a 1000), um espaço e uma unidade de tamanho. A segunda é a velocidade: um número inteiro (1 a 1000), um espaço e uma unidade de velocidade. As unidades são escritas exatamente como na tabela.

**Saída**

`Time: ` seguido do tempo como `horas:minutos:segundos`, com minutos e segundos em dois dígitos, como `Time: 0:00:56`. Arredonde **para cima** até um segundo inteiro: um download que leva 687,2 segundos precisa de 688.

Se uma unidade não está na tabela, imprima `Invalid unit: ` seguido dela, verificando o tamanho primeiro.

**O que você precisa saber**

- Escreva métodos que transformam uma quantidade e uma unidade em bytes, e em bits por segundo: `long bytes(long amount, String unit)`. Devolva `-1` para uma unidade que você não conhece.
- Use `long`: 2 TB são 16 trilhões de bits, muito além do que cabe num `int`.
- Com números inteiros, `(a + b - 1) / b` divide e arredonda para cima.
