# Avaliador de expressões

Calculadoras, planilhas e compiladores leem um texto como `2 + 3 * 4` e chegam a 14, não 20. O jeito clássico é um **analisador recursivo descendente**: uma função por nível de precedência, e funções que **chamam umas às outras**, o que no C exige declará-las antes com protótipos.

```
expr   = term   { (+ ou -) term }        soma e subtrai, da esquerda para a direita
term   = factor { (* ou /) factor }      multiplica e divide, da esquerda para a direita
factor = número | - factor | ( expr )    um número, um sinal de menos ou parênteses
```

Leia expressões, uma por linha, até o fim da entrada, e imprima o valor de cada uma:

```
-(7 - 10) / 2    1
8 / (3 - 3)      Error: division by zero
2 +              Error: syntax
```

**Entrada**

Linhas com números inteiros, `+ - * /`, parênteses e espaços. Todo valor no caminho fica entre −10¹⁸ e 10¹⁸.

**Saída**

Para cada linha, o valor dela, ou:

- `Error: syntax` quando a linha não é uma expressão válida (falta um número ou um parêntese, dois números seguidos, qualquer outro caractere);
- `Error: division by zero`.

Quando uma linha tem os dois problemas, informe o primeiro encontrado lendo da esquerda para a direita.

**Coisas para saber**

- Leia a entrada um caractere por vez com `getchar()`, guardando o próximo caractere numa variável, para uma função poder olhá-lo antes de decidir o que fazer.
- `/` é divisão inteira, arredondando para zero, como no próprio C: `-7 / 2` é `-3`. Um sinal de menos pode vir antes de qualquer fator: `--5` é 5.
- Quando algo der errado, guarde o erro num indicador, continue lendo até o fim da linha e imprima a mensagem ali.
