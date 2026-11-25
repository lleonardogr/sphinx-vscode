# Grupos de anagramas

Jogos de palavras, corretores ortográficos e detectores de plágio agrupam palavras que usam as mesmas letras: **anagramas**, como *listen*, *silent* e *enlist*. Leia uma lista de palavras e agrupe-as.

O truque é a **chave**: dê a cada palavra uma chave que seja igual para todos os seus anagramas e diferente para todo o resto, e conte as palavras por chave num mapa hash.

Para `listen silent enlist google tinsel banana` há três grupos: {listen, silent, enlist, tinsel}, {google} e {banana}.

```
groups: 3
largest group: 4
alone: 2
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000)
- Depois `n` palavras, uma por linha: de 1 a 10 letras minúsculas. A mesma palavra pode aparecer mais de uma vez, e cada vez conta.

**Saída**

`groups: ` e o número de grupos, `largest group: ` e o tamanho do maior, e `alone: ` e quantos grupos têm uma palavra só.

**Bom saber**

- Ordenar as letras de uma palavra dá uma boa chave: `char[] c = palavra.toCharArray(); Arrays.sort(c); String chave = new String(c);`
- `counts.merge(chave, 1, Integer::sum)` conta palavras por chave.
- Comparar cada palavra com todas as outras é O(n²): lento demais para 200.000 palavras.
