# Ingressos repetidos

Na entrada de um festival, leitores registram cada ingresso que passa. Um ingresso lido mais de uma vez provavelmente foi compartilhado ou copiado, então a segurança quer saber quantos ingressos se repetiram.

Leia os ids dos ingressos e imprima quantos ids **diferentes** aparecem mais de uma vez.

Para `5 3 5 9 3 5 1`, os ids 5 e 3 se repetem (o 5 até três vezes), então a resposta é:

```
2
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Linha 2: `n` ids de ingresso separados por espaços (1 ≤ id ≤ 1.000.000.000)

**Saída**

Um número: quantos ids diferentes aparecem pelo menos duas vezes.

**Bom saber**

- Comparar todos os pares de ingressos dá umas n²/2 = 20 bilhões de comparações para 200.000 ingressos: minutos, não segundos. Um teste oculto é desse tamanho.
- `set.add(x)` devolve `false` quando `x` já está num `HashSet`, e leva mais ou menos o mesmo tempo, seja qual for o tamanho do conjunto.
- Conte cada id repetido uma vez só, quantas vezes ele aparecer.
