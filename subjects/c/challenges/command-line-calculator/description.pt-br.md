# Calculadora de linha de comando

Uma calculadora de linha de comando lê expressões até a entrada acabar, e não pode cair quando alguém digita bobagem. No C, a armadilha é o `scanf`: quando não consegue ler um número, ele para, deixa os caracteres ruins na entrada e só avisa pelo **valor que devolve**. Programas que ignoram isso entram em laço infinito ou usam lixo.

Leia expressões `a op b`, uma por linha, até o fim da entrada. Para cada linha imprima o resultado, ou um erro, e termine com uma contagem.

```
5 + x        Error: not a number
8 / 0        Error: division by zero
2 ^ 3        Error: unknown operator
1 - 9        = -8
             Lines: 4, errors: 3
```

**Entrada**

Linhas com um inteiro, um caractere de operador e outro inteiro, separados por espaços. Os inteiros estão entre −10⁹ e 10⁹. Uma linha pode estar quebrada: uma palavra onde devia haver um número.

**Saída**

Para cada linha, uma destas:

- `= ` e o resultado, para `+`, `-`, `*`, `/` (divisão inteira) e `%`;
- `Error: not a number`, quando um número não pode ser lido (pule o resto da linha);
- `Error: division by zero`, para `/` ou `%` por 0;
- `Error: unknown operator`, para qualquer outro operador.

Depois `Lines: N, errors: E`.

**Coisas para saber**

- `scanf("%lld %c %lld", &a, &op, &b)` devolve 3 quando leu os três, menos quando parou antes, e `EOF` quando a entrada acabou antes de ler qualquer coisa.
- Depois de uma falha, leia e descarte caracteres com `getchar()` até `'\n'` ou `EOF`, para a próxima linha começar limpa.
- `/` e `%` arredondam para zero como no Java: `-7 / 2` é `-3` e `-7 % 2` é `-1`.
- `long long` guarda o produto de dois números de até 10⁹.
