# Os 3 maiores pontuadores

Monte um placar. Cada jogador é um `record Player(String name, int score)` (já declarado). Imprima os **3 primeiros** jogadores pela pontuação.

- As maiores pontuações vêm primeiro.
- Jogadores com a **mesma pontuação** ficam em ordem alfabética do nome.
- Se houver menos de 3 jogadores, imprima todos.

**Resolva sem laços `for` ou `while`.**

**Entrada**

Uma linha de entradas `nome:pontos` separadas por um espaço, por exemplo `ana:90 bruno:75 carla:95`.

**Saída**

```
1. carla (95)
2. ana (90)
3. bruno (75)
```

**O que você precisa saber**

- `Comparator.comparingInt(Player::score)` ordena pela pontuação (da menor para a maior). `.reversed()` inverte, e `.thenComparing(Player::name)` desempata.
- `.limit(3)` fica com os 3 primeiros elementos, e `.toList()` junta tudo em uma `List`.
- `IntStream.range(0, n)` é um stream dos números `0 … n-1`, útil para a numeração do placar.
