## Por que isso importa

Seu notebook, seu celular e o servidor de cada site têm um endereço IP. Configurações de rede, regras de firewall e painéis de nuvem estão cheios de notações como `192.168.1.10/24`. Esta lição mostra o que esses números significam e como um computador sabe se outro endereço está na mesma rede que ele.

## Um endereço IPv4 é um número de 32 bits

Um endereço IPv4 tem 4 bytes, escritos como 4 números de 0 a 255 separados por pontos. Os pontos são só para as pessoas: para o computador, `192.168.1.1` é um único número de 32 bits:

| Parte | 192 | 168 | 1 | 1 |
|-------|-----|-----|---|---|
| Bits | `11000000` | `10101000` | `00000001` | `00000001` |

Como um único número, ele é 192 × 256³ + 168 × 256² + 1 × 256 + 1 = 3.232.235.777. 32 bits permitem cerca de 4,3 bilhões de endereços, menos que os dispositivos do mundo hoje, e é por isso que o IPv6 foi criado.

## Parte da rede e parte do host

Um endereço tem duas partes: a **rede** a que ele pertence e o **host** (dispositivo) dentro dessa rede. O **prefixo**, escrito depois de uma barra, diz quantos bits pertencem à rede:

`192.168.1.130/24` quer dizer que os primeiros 24 bits (`192.168.1`) são a rede e os últimos 8 bits numeram os hosts.

A mesma coisa pode ser escrita como **máscara de sub-rede**: 24 uns seguidos de 8 zeros, que é `255.255.255.0`. Fazer AND de um endereço com sua máscara dá o endereço de rede.

## Rede, broadcast e hosts

Com um prefixo de p bits, o bloco tem 2³²⁻ᵖ endereços. Dois deles são reservados:

- o **endereço de rede**: todos os bits de host 0, o primeiro endereço do bloco;
- o **endereço de broadcast**: todos os bits de host 1, o último, que quer dizer "todos nesta rede".

| Prefixo | Máscara | Endereços | Hosts |
|---------|---------|-----------|-------|
| /24 | 255.255.255.0 | 256 | 254 |
| /26 | 255.255.255.192 | 64 | 62 |
| /16 | 255.255.0.0 | 65.536 | 65.534 |
| /8 | 255.0.0.0 | 16.777.216 | 16.777.214 |

Para `192.168.1.130/26`: o tamanho do bloco é 64, e 130 arredondado para baixo até um múltiplo de 64 é 128. Então a rede é `192.168.1.128`, o broadcast é `192.168.1.191`, e os hosts vão de `.129` a `.190`.

## Mesma rede ou não?

Quando seu computador envia um pacote, ele verifica se o destino está na rede dele: tem a mesma parte de rede? Se sim, o pacote vai direto para aquele dispositivo. Se não, vai para o **roteador** (o "gateway padrão"), que o encaminha em direção à internet.

## Endereços privados e NAT

Alguns blocos são reservados para redes privadas e nunca aparecem na internet pública:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

É por isso que tantas redes domésticas usam `192.168.0.x` ou `192.168.1.x`. Seu roteador tem um endereço público e faz a tradução entre ele e os endereços privados dos seus dispositivos. Isso é o **NAT** (tradução de endereços de rede).

## IPv6

Os endereços IPv6 têm **128 bits**, escritos como 8 grupos de dígitos hex: `2001:0db8:0000:0000:0000:ff00:0042:8329`, abreviado para `2001:db8::ff00:42:8329`. São cerca de 3,4 × 10³⁸ endereços, o suficiente para dar um a cada dispositivo, sem NAT.

## Resumo

- Um endereço IPv4 é um único número de 32 bits escrito como 4 bytes.
- O prefixo (`/24`) ou a máscara (`255.255.255.0`) o dividem em parte da rede e parte do host.
- Um bloco /p tem 2³²⁻ᵖ endereços: o primeiro é a rede, o último o broadcast, o resto são hosts.
- 10.x, 172.16–31.x e 192.168.x são privados; o IPv6 usa endereços de 128 bits.
