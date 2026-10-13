## Em resumo

O C trabalha direto nos bits dos inteiros: `&` (e), `|` (ou), `^` (ou exclusivo), `~` (não), `<<` e `>>` (deslocamentos). Use tipos **sem sinal** de largura fixa de `<stdint.h>`, como `uint32_t`: o tamanho deles é certo, e os deslocamentos são totalmente definidos.

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(void) {
    uint32_t flags = 0;
    flags |= 1u << 3;                     // liga o bit 3
    flags ^= 1u << 0;                     // inverte o bit 0
    int bit3 = (flags >> 3) & 1;          // lê o bit 3
    flags &= ~(1u << 0);                  // desliga o bit 0
    printf("%u %d\n", (unsigned) flags, bit3);   // 8 1

    float f = 1.0f;
    uint32_t bits;
    memcpy(&bits, &f, sizeof bits);       // os próprios bits do float
    printf("0x%08X\n", (unsigned) bits); // 0x3F800000
    return 0;
}
```

Uma **máscara** seleciona um campo: `(value >> 5) & 0x3F` pega os 6 bits que começam no bit 5.

**Cuidado:** deslocar pela largura do tipo ou mais, ou deslocar um valor com sinal negativo, é comportamento indefinido. Desloque valores sem sinal por menos que a largura deles.

<!-- readings -->
