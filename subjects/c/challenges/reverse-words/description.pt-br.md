# Inverter palavras

Inverta a ordem das palavras de uma linha **no lugar**, sem um segundo array: `the quick brown fox` vira `fox brown quick the`. É uma pergunta clássica de entrevista porque a resposta elegante é um truque com dois ponteiros.

Inverta a linha inteira e depois desinverta cada palavra:

```
the quick brown fox
xof nworb kciuq eht      inverte tudo
fox brown quick the      inverte cada palavra
```

Inverter um trecho de texto são dois ponteiros, um em cada ponta, trocando caracteres e andando um em direção ao outro.

**Entrada**

Linhas de no máximo 200 caracteres, até o fim da entrada. As palavras são separadas por espaços.

**Saída**

Cada linha com as palavras em ordem inversa. Os espaços também se invertem: `a  b` (dois espaços) vira `b  a`, e espaços no começo vão para o fim.

**Coisas para saber**

- Um `char *` pode percorrer uma string: `*p` é o caractere para onde ele aponta e `p++` passa para o próximo.
- Dois ponteiros para a mesma string podem ser comparados: `while (begin < end)`.
- Só um array de `char` é permitido: a própria linha.
