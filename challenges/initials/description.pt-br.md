# Iniciais

Transforme um nome completo em iniciais: a primeira letra de cada palavra em **maiúscula**, cada uma seguida de um ponto.

`Ana Lima` vira `A.L.` e `maria clara souza` vira `M.C.S.`.

**Entrada**

Uma linha com um nome de uma ou mais palavras. As palavras são separadas por um ou mais espaços, e a linha pode começar ou terminar com espaços.

**Saída**

As iniciais, como `A.L.`.

**O que você precisa saber**

- `trim()` remove os espaços do começo e do fim de uma String.
- `split(" +")` divide em cada grupo de espaços, então `"a   b"` dá `["a", "b"]`.
- `charAt(0)` devolve o primeiro `char` de uma String, e `Character.toUpperCase` deixa maiúsculo.
