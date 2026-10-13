# Cores RGB565

Telas pequenas, de displays de microcontroladores a consoles antigos, guardam uma cor em **16 bits** em vez de 24: 5 bits de vermelho, 6 de verde (o olho é mais sensível a ele) e 5 de azul, empacotados lado a lado num número:

```
bit:  15 … 11 | 10 … 5 | 4 … 0
     vermelho |  verde | azul
```

Escreva as duas direções. Empacotar mantém os bits de cima de cada canal de 8 bits; desempacotar alarga cada campo de volta para 8 bits repetindo os bits de cima, para o valor mais claro virar 255:

```
pack 255 128 0    →   0xFC00
unpack 0xFC00     →   255 130 0
```

O verde voltou como 130, não 128: empacotar perdeu os 2 bits mais baixos.

**Entrada**

Linhas até o fim da entrada: `pack R G B` com três valores de 0 a 255, ou `unpack 0xHHHH` com um valor de 16 bits em hexadecimal.

**Saída**

Para `pack`, a cor de 16 bits como `0x` e 4 dígitos hexadecimais maiúsculos (`printf("0x%04X")`). Para `unpack`, os três canais de 8 bits.

**Coisas para saber**

- Empacotar: `((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)`.
- Desempacotar: `(value >> 11) & 0x1F` é o campo vermelho; uma máscara de 6 uns, `0x3F`, pega o verde.
- Alargar um campo de 5 bits `v` para 8 bits: `(v << 3) | (v >> 2)`. Para o verde de 6 bits: `(v << 2) | (v >> 4)`.
- `scanf("%x", &value)` lê hexadecimal, com ou sem `0x`.
