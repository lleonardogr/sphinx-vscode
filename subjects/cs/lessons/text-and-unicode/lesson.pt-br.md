## Por que isso importa

O computador só guarda números, mas você lê texto, emoji e letras com acento nele o dia todo. O texto funciona porque todo mundo combina uma tabela que dá um número a cada caractere. Conhecer essa tabela explica truques como `'a' - 'A'` e textos embaralhados como "PortuguÃªs" onde deveria estar "Português".

## Caracteres são números

A primeira tabela amplamente compartilhada foi o **ASCII** (1963). Ela tem 128 códigos, de 0 a 127, o suficiente para o inglês:

| Caracteres | Códigos |
|------------|---------|
| espaço | 32 |
| `0` a `9` | 48 a 57 |
| `A` a `Z` | 65 a 90 |
| `a` a `z` | 97 a 122 |

Existe um padrão: cada letra minúscula fica exatamente **32** depois da sua maiúscula, e o dígito `7` é 48 + 7. Códigos abaixo de 32 não são imprimíveis: o 10 é o caractere de nova linha.

No Java um `char` é um número, então dá para fazer contas com ele:

```java
IO.println((int) 'A');       // 65
IO.println((char) 66);       // B
IO.println('a' - 'A');       // 32
IO.println((char) ('c' - 32)); // C: de minúscula para maiúscula
```

## Além do inglês: Unicode

128 códigos não têm espaço para é, ç, ã, grego, árabe, chinês ou emoji. Durante anos cada região usou sua própria tabela, e um arquivo escrito com uma tabela aparecia embaralhado quando lido com outra.

O **Unicode** resolveu isso com uma tabela enorme para todos os sistemas de escrita: mais de 150.000 caracteres até agora, cada um com um **code point** escrito em hex, como `U+0041` (A), `U+00E9` (é), `U+20AC` (€) e `U+1F600` (😀). Os primeiros 128 code points são exatamente o ASCII.

## UTF-8: guardando code points como bytes

Os code points vão até `U+10FFFF`, o que precisa de 21 bits. Usar 4 bytes para cada caractere desperdiçaria espaço, então a maioria dos arquivos usa **UTF-8**, que ocupa de 1 a 4 bytes:

| Code points | Bytes | Exemplos |
|-------------|-------|----------|
| U+0000 a U+007F | 1 | A, 7, ? |
| U+0080 a U+07FF | 2 | é, ç, ã, ñ |
| U+0800 a U+FFFF | 3 | €, a maioria dos caracteres chineses |
| U+10000 a U+10FFFF | 4 | 😀 e outros emoji |

Texto em inglês continua exatamente tão pequeno quanto no ASCII, e qualquer arquivo ASCII já é UTF-8 válido. Letras com acento ocupam 2 bytes: "Olá" tem 3 caracteres, mas 4 bytes.

Quando um programa lê bytes UTF-8 como se cada byte fosse um caractere, é (bytes `C3 A9`) aparece como "Ã©". É esse o texto embaralhado que você às vezes vê: os bytes estão certos, a tabela usada para lê-los está errada.

## Texto no Java

Um `char` do Java tem 16 bits, o suficiente para code points até `U+FFFF`. Caracteres além disso, como a maioria dos emoji, ocupam **dois** `char`s, então `"😀".length()` é 2. Para texto do dia a dia com letras, dígitos e acentos, um `char` é um caractere.

## Resumo

- Todo caractere tem um número: o ASCII dá `A` = 65, `a` = 97, `0` = 48, espaço = 32.
- O Unicode numera todos os caracteres de todos os idiomas, escritos como `U+00E9`.
- O UTF-8 guarda um code point em 1 a 4 bytes; caracteres ASCII ocupam 1, letras com acento 2.
- Texto embaralhado quer dizer que os bytes foram lidos com a tabela errada.
