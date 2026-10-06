## Por que isso importa

Uma foto do seu celular e uma música da sua playlist também são só números. Saber como eles são guardados explica por que uma foto pode ocupar 6 MB, o que "1080p" e "44,1 kHz" querem dizer, e por que existem formatos comprimidos como JPEG e MP3.

## Imagens são grades de pixels

Uma imagem digital é uma grade de quadradinhos chamados **pixels**. Uma tela Full HD tem 1920 × 1080 = 2.073.600 deles.

Cada pixel guarda uma cor como três números, quanto de luz **vermelha**, **verde** e **azul** misturar, normalmente um byte cada, de 0 a 255:

| Cor | Vermelho | Verde | Azul | Hex |
|-----|----------|-------|------|-----|
| preto | 0 | 0 | 0 | `#000000` |
| branco | 255 | 255 | 255 | `#FFFFFF` |
| vermelho | 255 | 0 | 0 | `#FF0000` |
| laranja | 255 | 136 | 0 | `#FF8800` |

Três bytes são 24 bits, então um pixel pode ser uma de 2²⁴ ≈ 16,7 milhões de cores. Cores da web são escritas em hex: dois dígitos hex por byte.

O tamanho de uma imagem sem compressão é:

> largura × altura × bytes por pixel

Uma imagem Full HD ocupa 1920 × 1080 × 3 = 6.220.800 bytes, cerca de 5,9 MiB. Uma foto de 12 megapixels ocupa cerca de 36 MB.

## Som é uma lista de amostras

O som é uma onda de pressão do ar. Para guardá-lo, um microfone mede a onda muitas vezes por segundo; cada medida é uma **amostra**, um número:

- A **taxa de amostragem** é quantas amostras por segundo. Os CDs usam 44.100 (44,1 kHz), um pouco mais que o dobro do som mais agudo que as pessoas escutam.
- A **profundidade de bits** é quantos bits por amostra. Os CDs usam 16 bits: 65.536 níveis possíveis.
- **Canais**: 1 para mono, 2 para estéreo.

O tamanho de um som sem compressão é:

> taxa de amostragem × bytes por amostra × canais × segundos

Um minuto de áudio de CD tem 44.100 × 2 × 2 × 60 = 10.584.000 bytes, cerca de 10 MB. Uma música de três minutos tem cerca de 30 MB.

## Compressão

Esses tamanhos são o motivo de a maioria das mídias ser **comprimida**:

- Formatos **sem perda** (PNG, FLAC, ZIP) acham padrões e os guardam de forma mais curta, como escrever "100 × azul" em vez de "azul, azul, azul, …". O original volta exatamente igual.
- Formatos **com perda** (JPEG, MP3, a maioria dos vídeos) também jogam fora detalhes que as pessoas mal percebem. Os arquivos ficam 10 vezes menores ou mais, mas o original não pode ser recuperado exatamente.

Uma música de 30 MB vira um MP3 de 3 MB, e a foto de 36 MB um JPEG de 4 MB.

## Resumo

- Uma imagem é uma grade de pixels; cada pixel normalmente tem 3 bytes: vermelho, verde, azul.
- Cores em hex como `#FF8800` são esses 3 bytes.
- O som é guardado como amostras: taxa × bytes por amostra × canais × segundos.
- A compressão deixa as mídias menores: sem perda mantém cada bit, com perda descarta detalhes.
