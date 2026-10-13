# Buffer circular

Um sensor manda uma leitura por segundo, e o mostrador exibe a média das últimas, para suavizar o ruído. Microcontroladores têm pouca memória, então guardam exatamente as últimas `k` leituras num array de `k` posições, escrevendo cada leitura nova por cima da mais antiga e voltando ao começo quando chegam ao fim. Isso é um **buffer circular**, usado em áudio, teclados e placas de rede.

Leia as leituras e, depois de cada uma, imprima a média das últimas `k` (ou de todas, enquanto houver menos de `k`). Quando uma leitura substituir uma mais antiga, diga também qual:

```
k = 3:   10  →  10.00
         20  →  15.00
         30  →  20.00
         40  →  30.00 (dropped 10)
         50  →  40.00 (dropped 20)
```

**Entrada**

- Linha 1: `k` (1 ≤ k ≤ 100) e `n`, a quantidade de leituras (1 ≤ n ≤ 10.000)
- Linha 2: `n` leituras inteiras de −1000 a 1000

**Saída**

Uma linha por leitura: a média com 2 casas, seguida de ` (dropped X)` quando a leitura empurrou para fora a mais antiga, `X`.

**Coisas para saber**

- O array tem `k` posições e um índice para a próxima escrita. Depois da última posição, o índice volta a 0, muitas vezes escrito `(i + 1) % k`.
- Depois que o buffer encheu, a posição que vai ser escrita guarda a leitura mais antiga.
- Uma soma corrente evita somar a janela inteira toda vez.
