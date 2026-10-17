# Capacidade do caminhão

Um depósito precisa despachar `n` pacotes na ordem em que saem da esteira, em até `d` dias. Todo dia um caminhão é carregado: os pacotes entram em ordem até que o próximo passaria da capacidade do caminhão, e então o caminhão sai. Caminhões maiores custam mais, então a empresa quer a **menor capacidade** que despacha tudo em `d` dias ou menos.

Para os pesos `3 2 2 4 1 4` e `d = 3`:

- Capacidade 6: `[3 2] [2 4] [1 4]`, 3 dias. Funciona.
- Capacidade 5: `[3 2] [2] [4 1] [4]`, 4 dias. Dias demais.

Então a resposta é:

```
6
```

**Entrada**

- Linha 1: `n` e `d` (1 ≤ d ≤ n ≤ 200.000)
- Linha 2: `n` pesos de pacote (1 ≤ peso ≤ 100.000)

**Saída**

A menor capacidade que despacha todos os pacotes em no máximo `d` dias.

**Bom saber**

- Testar uma capacidade é uma simulação simples sobre os pacotes.
- Se uma capacidade funciona, toda capacidade maior também funciona. Então "a capacidade c funciona?" é uma pergunta de sim ou não em que dá para fazer busca binária, entre o pacote mais pesado e o peso total.
- Tentar cada capacidade a partir do pacote mais pesado pode significar bilhões de simulações.
- O peso total pode chegar a 2 × 10¹⁰, acima do limite do `int`: use `long`.
