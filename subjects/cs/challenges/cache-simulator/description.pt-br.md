# Simulador de cache

Um **cache** guarda cópias da memória usada recentemente perto da CPU. Numa **falha**, ele não carrega só um byte: carrega um **bloco** inteiro de bytes vizinhos, esperando que o programa os use em seguida. É por isso que ler um array em ordem é rápido.

Simule o tipo mais simples, um cache de **mapeamento direto** com `L` linhas e blocos de `B` bytes. Para cada endereço que a CPU lê:

- o bloco dele é `endereco / B`, e o bloco só pode ir na linha `bloco % L`;
- se essa linha já guarda o bloco, é um **acerto** (hit);
- senão é uma **falha** (miss), e o bloco é carregado nessa linha, substituindo o que estava lá.

Com 4 linhas de 4 bytes, ler os endereços de 0 a 7 em ordem dá *falha acerto acerto acerto falha acerto acerto acerto*: uma falha por bloco. Ler 0, 16, 32, 48, 0, 16 falha toda vez, porque todos esses blocos disputam a linha 0.

**Entrada**

Três linhas: `L` e `B` (1 a 64 cada), o número de leituras `n` (1 a 100), e os `n` endereços (de 0 a 1.000.000), separados por espaços. O cache começa vazio.

**Saída**

Para cada endereço, uma linha com o endereço e `hit` ou `miss`. Depois `Hits: h/n` e `Hit rate: ` com a porcentagem e uma casa decimal, seguida de `%`.

**O que você precisa saber**

- Um `int[] cache = new int[L]` preenchido com `-1` pode guardar o bloco de cada linha.
- O endereço sozinho não decide um acerto: dois endereços do mesmo bloco dividem uma linha e um carregamento.
- Caches de verdade têm mais truques (vários blocos por linha, substituição mais esperta), mas este já mostra por que a localidade importa.
