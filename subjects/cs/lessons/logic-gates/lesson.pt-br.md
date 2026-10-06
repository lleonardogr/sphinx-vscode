## Por que isso importa

Todo `if` que você escreve depende de uma condição que é verdadeira ou falsa. Dentro do processador, a mesma ideia é construída com circuitos minúsculos chamados **portas lógicas**, e tudo o que um computador faz, somar, comparar, escolher, é feito combinando essas portas. Essa lógica se chama **booleana** por causa de George Boole, que a descreveu em 1854.

## Verdadeiro e falso como bits

A lógica booleana só tem dois valores: **verdadeiro** e **falso**, ou **1** e **0**. Uma porta recebe um ou dois bits de entrada e produz um bit de saída. A **tabela-verdade** dela lista a saída para cada combinação de entradas.

## As portas básicas

| A | B | AND | OR | XOR | NAND | NOR |
|---|---|-----|----|-----|------|-----|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

- **AND** (E) é 1 só quando as duas entradas são 1.
- **OR** (OU) é 1 quando pelo menos uma entrada é 1.
- **XOR** (OU exclusivo) é 1 quando as entradas são diferentes.
- **NOT** (NÃO) tem uma entrada e a inverte: NOT 0 = 1, NOT 1 = 0.
- **NAND** e **NOR** são AND e OR seguidos de NOT.

A NAND é especial: todas as outras portas podem ser construídas só com portas NAND, então, em princípio, um processador inteiro poderia ser feito de um único tipo de porta.

## Portas no Java

Os operadores booleanos do Java são as mesmas portas:

| Porta | Java |
|-------|------|
| AND | `a && b` |
| OR | `a \|\| b` |
| XOR | `a ^ b` |
| NOT | `!a` |

```java
boolean adult = age >= 18;
boolean hasTicket = true;
if (adult && hasTicket) { ... }   // AND
if (!adult || !hasTicket) { ... } // o contrário, por De Morgan
```

`&&` e `||` são operadores de **curto-circuito**: se o lado esquerdo já decide a resposta, o lado direito não é avaliado. É por isso que `s != null && s.length() > 0` é seguro.

## As leis de De Morgan

Duas regras ajudam a simplificar condições:

- NOT (A AND B) = (NOT A) OR (NOT B)
- NOT (A OR B) = (NOT A) AND (NOT B)

No Java: `!(a && b)` é o mesmo que `!a || !b`. "Não (chuvoso e frio)" quer dizer "não chuvoso, ou não frio".

## Somando com portas

As portas conseguem fazer contas. Somar dois bits dá um bit de soma e um bit de "vai um":

| A | B | Soma | Vai um |
|---|---|------|--------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

A coluna da soma é exatamente o **XOR** e a coluna do vai um é exatamente o **AND**. Encadeie 32 desses somadores (passando os vai-um adiante) e você consegue somar dois `int`s: é assim que funciona o somador do processador.

## Resumo

- A lógica booleana trabalha com dois valores, verdadeiro e falso, que os computadores guardam como 1 e 0.
- AND, OR, XOR, NOT, NAND e NOR são as portas básicas; uma tabela-verdade lista as saídas delas.
- No Java: `&&`, `||`, `^` e `!`; `&&` e `||` pulam o lado direito quando podem.
- De Morgan: `!(a && b)` é igual a `!a || !b`. XOR e AND juntos somam dois bits.
