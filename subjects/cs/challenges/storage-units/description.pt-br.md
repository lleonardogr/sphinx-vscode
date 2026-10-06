# Unidades de armazenamento

Leia um tamanho em **bytes** e imprima-o de duas formas: com as unidades **SI** que discos e o macOS usam (KB, MB, GB…, múltiplos de **1000**), e com as unidades **binárias** que o Windows e a memória RAM usam (KiB, MiB, GiB…, múltiplos de **1024**).

1.500.000 bytes são **1.50 MB**, mas só **1.43 MiB**, porque um MiB (1.048.576 bytes) é maior que um MB (1.000.000 bytes).

| SI | Bytes | Binária | Bytes |
|----|-------|---------|-------|
| KB | 1000 | KiB | 1024 |
| MB | 1000² | MiB | 1024² |
| GB | 1000³ | GiB | 1024³ |
| TB | 1000⁴ | TiB | 1024⁴ |
| PB | 1000⁵ | PiB | 1024⁵ |

Em cada sistema, use a **maior unidade em que o valor é pelo menos 1** e imprima o valor com **2 casas decimais**, com ponto. Tamanhos abaixo de um kilobyte (ou kibibyte) são impressos como bytes inteiros, como `512 B`.

**Entrada**

Um número inteiro de bytes (0 ≤ bytes ≤ 2 × 10¹⁵).

**Saída**

Duas linhas: `SI: ` e o tamanho em unidades SI, depois `Binary: ` e o tamanho em unidades binárias.

**O que você precisa saber**

- Dividir por 1000 (ou 1024) enquanto o valor ainda for 1000 (ou 1024) ou mais acha a unidade certa. Conte as divisões: 1 é K, 2 é M, 3 é G, …
- Divida um `double`, não um `long`, para não perder as casas decimais: `double value = bytes;`
- `String.format("%.2f", 1.4305)` dá `"1.43"`.
