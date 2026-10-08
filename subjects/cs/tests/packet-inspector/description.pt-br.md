# Inspetor de pacotes

O **Wireshark** deixa ver os pacotes que um computador envia e recebe, byte por byte, e decodifica cada um. Construa uma versão minúscula: decodifique um pacote IPv4 que leva **UDP**.

Você recebe o pacote como bytes em hexadecimal. Ele começa com o **cabeçalho IPv4**:

| Bytes | Campo |
|---|---|
| 0 | 4 bits altos: a **versão** (4); 4 bits baixos: o **tamanho do cabeçalho** em palavras de 4 bytes (5 quer dizer 20 bytes) |
| 2–3 | o **tamanho total** do pacote em bytes, com o cabeçalho |
| 8 | o **TTL** (tempo de vida) |
| 9 | o **protocolo**: 1 é ICMP, 6 é TCP, 17 é UDP |
| 10–11 | o **checksum** do cabeçalho |
| 12–15 | o endereço de **origem** |
| 16–19 | o endereço de **destino** |

Os bytes que não estão na tabela (1, 4–7) são outros campos que você pode pular. Um cabeçalho com mais de 20 bytes tem opções no fim; a próxima parte começa no tamanho do cabeçalho. Números de dois bytes são **big-endian**: o primeiro byte é o alto, então `00 25` é 37.

**O checksum** detecta cabeçalhos corrompidos. Some os bytes do cabeçalho como números de 16 bits (bytes 0–1, 2–3 e assim por diante, com o checksum). Sempre que a soma passar de `FFFF`, tire a parte acima de 16 bits e some-a de volta embaixo: `sum = (sum & 0xFFFF) + (sum >> 16)`. O cabeçalho é **válido** quando a soma final é `FFFF`.

Quando o protocolo é UDP, vem o **cabeçalho UDP**: 8 bytes, dos quais os bytes 0–1 são a **porta de origem** e 2–3 a **porta de destino**. O **conteúdo** (os dados) vem depois e termina no tamanho total. Os bytes depois disso são enchimento, não fazem parte do pacote.

Imprima:

```
Version: 4
Header length: 20 bytes
Total length: 37 bytes
TTL: 64
Protocol: UDP (17)
Source: 192.168.1.20
Destination: 10.0.0.5
Checksum: 0x52C1 (valid)
Ports: 51000 -> 514
Payload: Hi Sphinx
```

- O checksum é o valor dos bytes 10–11 com 4 dígitos hexadecimais maiúsculos, depois `(valid)` ou `(invalid)`.
- Protocolos que não sejam 1, 6 ou 17 são `Unknown`, como `Protocol: Unknown (99)`.
- Imprima `Ports` e `Payload` só para UDP. No conteúdo, os bytes de 32 a 126 são impressos como o caractere ASCII deles e qualquer outro byte como `.`; um conteúdo vazio é `Payload: (empty)`.
- Se a versão não for 4, imprima só `Not IPv4`.

**Entrada**

Uma linha: os bytes do pacote como números hexadecimais de 2 dígitos (maiúsculos ou minúsculos) separados por espaços. O exemplo acima é:

```
45 00 00 25 1c 46 40 00 40 11 52 c1 c0 a8 01 14 0a 00 00 05 c7 38 02 02 00 11 00 00 48 69 20 53 70 68 69 6e 78
```

**Saída**

As linhas acima.

**Para saber**

- `Integer.parseInt("c0", 16)` lê um byte em hexadecimal, e `"%04X".formatted(n)` imprime 4 dígitos hexadecimais.
- `b >> 4` dá os 4 bits altos de um byte, e `b & 0x0F` os 4 bits baixos.
- `(char) 72` é `'H'`.
