# Maior de três (método)

Um **método** é um pedaço de código com nome que pode ser chamado várias vezes. Escreva o método `max`, que recebe três números inteiros e **devolve** o maior.

```java
int max(int a, int b, int c)
```

O `main` está pronto: ele lê `t` linhas com três números cada e imprime `Max: ` seguido do que o seu método devolver.

**Entrada**

- Linha 1: `t`, o número de linhas a seguir
- Depois, `t` linhas com três inteiros `a b c`

**Saída**

`Max: x` para cada linha.

**O que você precisa saber**

- Os **parâmetros** `a`, `b` e `c` recebem os valores passados na chamada `max(1, 2, 3)`.
- `return valor;` termina o método e devolve `valor` para quem chamou.
- O tipo antes do nome (`int`) diz o que o método devolve. Escreva as comparações você mesmo, sem `Math.max`.
