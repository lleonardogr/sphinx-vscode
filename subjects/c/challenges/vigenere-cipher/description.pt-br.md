# Cifra de Vigenère

Por três séculos a cifra de Vigenère foi chamada de "a cifra indecifrável". Em vez de deslocar todas as letras pelo mesmo valor, como a cifra de César, ela desloca cada letra pela próxima letra de uma **chave**: `A` desloca 0, `B` desloca 1, … `Z` desloca 25, e a chave se repete quanto for preciso.

```
texto  A T T A C K   A T   D A W N
chave  L E M O N L   E M   O N L E
       L X F O P V   E F   R N H R
```

`A` + `L` (11) é `L`; `T` + `E` (4) é `X`. Espaços e pontuação são copiados como estão, e não gastam uma letra da chave. Decifrar desloca para trás.

**Entrada**

Três linhas: `encrypt` ou `decrypt`; a chave (1 a 50 letras, maiúsculas ou minúsculas); o texto (no máximo 200 caracteres).

**Saída**

O texto cifrado ou decifrado. As letras mantêm maiúscula ou minúscula, o resto fica igual.

**Coisas para saber**

- Uma string é um array de `char`, então dá para mudar `text[i]` no lugar.
- `isalpha`, `isupper` e `tolower`, de `<ctype.h>`, testam e convertem letras. Passe para elas um `unsigned char`.
- `(c - 'A' + shift) % 26` é a nova posição da letra no alfabeto.
