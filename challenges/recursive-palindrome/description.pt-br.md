# Palíndromo recursivo

Um **palíndromo** é lido do mesmo jeito de frente para trás e de trás para frente. Ignorando maiúsculas, espaços e pontuação, `A man, a plan, a canal: Panama!` é um.

O `main` já limpa o texto (minúsculas, só letras e dígitos). Escreva `isPalindrome` de forma **recursiva**:

- um texto com 0 ou 1 caractere é palíndromo
- se o primeiro e o último caracteres forem diferentes, não é
- senão, é palíndromo quando a parte **entre** eles é

**Entrada**

Uma linha de texto com pelo menos uma letra ou dígito.

**Saída**

`"Racecar" is a palindrome` ou `"hello" is not a palindrome`, com a linha como foi digitada (sem os espaços em volta).

**O que você precisa saber**

- `text.substring(1, text.length() - 1)` tira o primeiro e o último caracteres, então cada chamada trabalha com um texto menor até chegar ao caso base.
- Em vez de criar substrings, você também pode passar dois índices, `isPalindrome(text, left, right)`, e aproximar um do outro.
- Resolva sem laços e sem inverter a String.
