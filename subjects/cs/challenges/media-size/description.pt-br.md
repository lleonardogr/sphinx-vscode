# Tamanho de mídia

Imagens e som também são guardados como números, então dá para calcular quanto espaço eles ocupam **antes da compressão**.

- Uma **imagem** é uma grade de pixels. Cada pixel ocupa uma quantidade de bits: 24 bits (um byte para o vermelho, um para o verde e um para o azul) numa foto típica. Tamanho = largura × altura × bits por pixel.
- O **som** é guardado como amostras: medidas da onda sonora feitas muitas vezes por segundo. Tamanho = amostras por segundo × bits por amostra × canais × segundos. A qualidade de CD é 44.100 amostras por segundo, 16 bits, 2 canais (estéreo).

Leia a descrição de uma imagem ou de uma gravação e imprima o tamanho dela.

**Entrada**

Uma linha, ou `image W H BITS` (largura, altura e bits por pixel) ou `audio RATE BITS CHANNELS SECONDS`. Todos os números são inteiros e positivos.

**Saída**

`N bytes (M MiB)`: o tamanho em bytes (bits ÷ 8, arredondado para cima) e em MiB (bytes ÷ 1.048.576) com 2 casas decimais, com ponto.

**O que você precisa saber**

- Calcule em `long`: uma hora de som com qualidade de estúdio tem mais de 8 bilhões de bits.
- `(bits + 7) / 8` divide por 8 e arredonda para cima.
- Um MiB são 1024 × 1024 bytes. Divida como `double` para manter as casas decimais.
