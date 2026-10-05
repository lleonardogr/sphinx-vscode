# Compressão de texto

Comprima um texto trocando cada sequência de letras repetidas pela letra e quantas vezes ela se repete. `aaaabbbc` vira `a4b3c1`.

A compressão só ajuda quando o resultado fica **menor**. Se o texto comprimido não for menor que o original, imprima o original: `abc` viraria `a1b1c1`, então a resposta é `abc`.

**Entrada**

Uma linha com letras minúsculas (de 1 a 1000).

**Saída**

O texto comprimido, ou o original se comprimir não deixar menor.

**O que você precisa saber**

- Somar Strings com `+` em um laço cria uma String nova a cada vez. Um `StringBuilder` cresce no lugar: `sb.append(c).append(count)`.
- Uma sequência termina quando o próximo caractere é diferente, ou quando o texto acaba. Cuidado para não ler depois do último índice.
- As contagens podem ter mais de um dígito: `aaaaaaaaaaaa` vira `a12`.
