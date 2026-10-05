# Juiz da forca

Escreva o juiz de um jogo da **forca**. O programa conhece a palavra secreta e confere os palpites do jogador, uma letra por vez. Este teste junta **condicionais**, **laços** e **Strings** em um programa só.

**O que o seu programa faz**

1. Leia a palavra secreta (só letras minúsculas). O jogador tem **6 vidas**. Imprima a palavra escondida, um `_` por letra, separados por espaços:

   ```
   Word: _ _ _ _
   ```

2. Depois leia palpites, um por linha, até o jogador ganhar ou perder. Letras maiúsculas contam como minúsculas (`J` é o mesmo que `j`).

| Palpite | Imprime | Vidas |
|---------|---------|-------|
| não é uma letra só (como `ab` ou `1`) | `Invalid guess` | não muda |
| uma letra já chutada | `Already guessed: x` | não muda |
| uma letra nova que está na palavra | `Good guess!` e depois a linha `Word:` | não muda |
| uma letra nova que não está na palavra | `Wrong! Lives left: n` e depois a linha `Word:` | perde 1 |

3. O jogo acaba assim que:

   - todas as letras forem reveladas: imprima `You win! The word was java`
   - as vidas chegarem a `0`: imprima `You lose! The word was java`

   A entrada sempre tem palpites suficientes para terminar o jogo. Ignore as linhas que vierem depois do fim.

**Exemplo**

Entrada:

```
java
a
x
J
v
```

Saída:

```
Word: _ _ _ _
Good guess!
Word: _ a _ a
Wrong! Lives left: 5
Word: _ a _ a
Good guess!
Word: j a _ a
Good guess!
Word: j a v a
You win! The word was java
```

**O que você precisa saber**

- `toLowerCase()` transforma `J` em `j`; `length() == 1` e `Character.isLetter(c)` conferem se o palpite é uma letra só.
- Uma String pode guardar as letras já chutadas, e `indexOf` (ou `contains`) confere se uma letra está nela.
- Um `StringBuilder` ajuda a montar a linha `Word:` sem espaço sobrando no fim.
- Guarde `lives` em uma variável declarada **antes** do laço.
